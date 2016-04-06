"use strict";
/* jshint node: true, esnext: true, globalstrict: true, undef: true */
/* global console, require, process  */
/* global be, not, is_string, log, combine, is_blank_string, is_file, replace, is_something  */
/* global reduce, global, each_x, is_length_zero, to_string, is_dir, is_empty, is_true, is_whitespace, to_default, is_plain_object, find */


const _                     = require('lodash');
const cheerio               = require('cheerio');
const Handlebars            = require('handlebars');
const fs                    = require('fs');
const util                  = require('util');
const path                  = require('path');
const he                    = require('he');
const FILES_USED            = [];
const CHILD_PROCESS         = require("child_process");

_.extend(global, require("../node/build/node"));

const ARGS     = process.argv.slice(2);
const ARGS_NAMED = {"templates": []};
var   raw_name, current_name, raw_val;

switch (ARGS.length) {

  case 3:
    ARGS_NAMED.public_dir = ARGS.pop();
    ARGS_NAMED.dir        = ARGS.pop();
    ARGS_NAMED.templates  = [ARGS.pop()];
    break;

  default:
    while (ARGS.length > 0) {
      raw_name = ARGS.shift();

      switch (raw_name) {

        case "--public-dir":
          current_name = "public_dir";
          ARGS_NAMED[current_name] = shift_args(ARGS);
          break;

        case "--input-dir":
          current_name = "input_dir";
          ARGS_NAMED[current_name] = shift_args(ARGS);
          ARGS_NAMED.templates = ARGS_NAMED
          .templates
          .slice(0)
          .concat(
            CHILD_PROCESS.execFileSync("find", [ARGS_NAMED.input_dir, "-type", "f", "name", "_*", "-prune", "-o", "-name", "*.html", "-print"])
            .toString()
            .trim()
            .split("\n")
          );
          break;

        case "--output-dir":
          current_name = "dir";
          ARGS_NAMED[current_name] = shift_args(ARGS);
          break;

        case "--template":
          current_name = "templates";
          ARGS_NAMED.templates = ARGS_NAMED.templates.slice(0).push(shift_args(ARGS));
          break;

        default:
          console.error("!!! Unknown option: " + to_string(raw_name));
          console.error("=== Original args: " + to_string(process.argv));
          process.exit(1);

      } // === switch (raw_name)

    }
} // === switch

const public_dir = reduce(ARGS_NAMED.public_dir, be(is_string), _.trim, be(not(is_length_zero)));
const dir        = reduce(ARGS_NAMED.dir,        be(is_dir));
const templates  = ARGS_NAMED.templates;

each_x(templates, function (template) {

  const name       = path.basename(template, '.html');
  const vars       = {};
  const is_partial = path.basename(template).match(/^_+\./);

  if (is_partial) {
    console.error('!!! Template is a partial: ' + template);
    process.exit(1);
  }

  // ==== Process and write file(s):
  reduce(
    template,
    read_and_cache_file_name,
    string_to_$,

    copy_files_to_public, // .css, .js files
    function ($) { return render_locals($, ABOUT('vars')); },

    tag_paste_to_markup,

    scripts_to_tag,
    styles_to_tag,
    tag_template_to_script,

    merge_tags('head'),
    merge_tags('tail'),
    merge_tags('top'),
    merge_tags('bottom'),

    remove_duplicate_tag('link'),
    remove_duplicate_tag('script'),
    remove_duplicate_tag('meta'),

    write_conditions_js,
    markup_to_file
  );

  function ABOUT(key) { // === Function that returns state.
    switch (key) {
      case 'template':         return template;
      case 'template-dir':     return path.dirname(template);
      case 'template-path':    return template;
      case 'name':             return name;
      case 'out-dir':          return dir;
      case 'new-file':         return dir + '/' + _.compact([name, arguments[1]]).join('-');
      case 'public-dir':       return public_dir;
      case 'json-file':        return path.join(ABOUT('out-dir'), "conditions.json");
      case 'vars':             return vars;
      case 'new-var':
        let k = reduce(
          arguments[1],
          be(is_string),
          _.trim,
          replace(/\./g, '_')
        );
        vars[k] = reduce(arguments[2], be(is_something));
        return ABOUT('vars');

      default:
        error("!!! Unknown key: " + key);
    }
  }


  function write_conditions_js($) {
    // === Get new conditions:
    let new_conds = tag_when_to_object($);
    if (is_empty(new_conds))
      return $;

    // === Read:
    var conds = read_conds();

    // === Merge:
    conds[ABOUT('name')] = new_conds.conditions;

    // === Write:
    fs.writeFileSync(ABOUT('json-file'), JSON.stringify(conds, null, '  '));

    new_conds.$whens.remove();
    return $;
  } // === write_conditions_js

  function rel_path(file) {
    var public_dir = path.resolve(ABOUT('public-dir'));
    var full       = path.resolve(file);
    var fin        = full.replace(public_dir, '');
    if (fin.indexOf('/') !== 0)
      fin = '/' + fin;
    return fin;
  }

  function styles_to_tag($) {
    var new_path = ABOUT('new-file', 'style.css');
    var contents = map_to_html_and_remove($, $('style'));

    if (is_blank_string(contents))
      return $;

    fs.writeFileSync(new_path, contents);

    return append_to_tag(
      'head',
      $,
      '<link rel="stylesheet" type="text/css" href="' + rel_path(new_path) + '" />'
    );
  }

  function scripts_to_tag($) {
    var new_path = ABOUT('new-file', 'script.js');
    let scripts  = _.filter( $('script'), function (raw) {
      return is_blank_string($(raw).attr('src') || '');
    });
    var contents = map_to_html_and_remove($, scripts);

    if (is_blank_string(contents))
      return $;

    const SCRIPT_HEAD = "/* jshint browser: true, undef: true */\n";
    fs.writeFileSync(new_path, SCRIPT_HEAD + contents);


    return append_to_tag(
      'bottom',
      $,
      '<script type="application/javascript" src="' + rel_path(new_path)  + '"></script>'
    );
  } // === scripts_to_tag

  function read_conds() {
    var file = ABOUT('json-file');
    if (!is_file(file))
      return {};
    var raw = fs.readFileSync(file).toString();
    if (is_blank_string(raw))
      return {};
    return JSON.parse(raw);
  }

  function markup_to_file($) {
    fs.writeFileSync(
      ABOUT('new-file') + '.html',
      cheerio_to_mustache_to_html($)
    );
    return $;
  }

  function cheerio_to_mustache_to_html($) {
    let compiler = Handlebars.compile($.html(), {strict: true});
    return compiler(ABOUT('vars'));
  }

  function tag_paste_to_markup($) {
    var pastes = $('paste');

    if (is_empty(pastes))
      return $;

    _.each($('paste'), function (raw) {
      var src      = reduce($(raw).attr('src'), be(is_string), _.trim, be(not(is_length_zero)));
      var contents = read_file(src);
      $(raw).replaceWith(contents);
    });


    return reduce(
      $,
      render_locals,
      tag_paste_to_markup
    );
  } // === function tag_paste_to_markup

  function read_file(file_path) {
    function read(src) {
      try {
        return fs.readFileSync(src).toString();
      } catch (e) {
        return null;
      }
    } // === function

    var contents;
    var paths = [
      path.join(process.cwd(), file_path),
      path.join(path.dirname(ABOUT('template-path')), file_path),
      path.join(path.dirname(ABOUT('new-file')), file_path)
    ];
    var efforts = paths.slice(0);

    while (!is_string(contents) && !is_empty(paths)) {
      contents = read(paths.shift());
    }

    if (contents)
      return contents;

    console.error('!!! File not found: ' + file_path + ' in: ' + to_string(efforts));
    process.exit(1);
  } // === function read_file


  function copy_files_to_public($) {
    let files = filter_files(ABOUT('template-dir'), /(.+)(\.css|\.js)$/);
    _.each(files, function (orig) {
      let file_name = path.basename(orig);
      let new_file = ABOUT('new-file') + '.' + file_name;
      fs.writeFileSync( new_file, fs.readFileSync(orig));
      ABOUT('new-var', file_name, rel_path(new_file));
    });
    return $;
  } // === function copy_files_to_public
}); // === each_x templates


// ============================================================================
// === Finish writing file. ===================================================
// ============================================================================


function map_to_html_and_remove($, coll) {
  return _.compact(_.map(coll, function (raw) {
    var html = $(raw).html();
    $(raw).remove();
    return html;
  })).join("\n");
}

function append_to_tag(tag_name, $, html) {
  var target = $(tag_name);
  if (!target[0]) {
    $.root().prepend('<' + tag_name + '></' + tag_name + '>');
    target = $(tag_name);
  }
  target.append(html);
  return $;
} // === append_to_tag

// === Used to help other functions check if
// file has already been used before. Counterpart
// is `read_and_cache_file_name`.
function is_file_loaded(file) {
  return _.includes(FILES_USED, fs.realpathSync(file));
}

function read_and_cache_file_name(file) {
  let canon = fs.realpathSync(file);
  if (!_.includes(FILES_USED, canon))
    FILES_USED.push(canon);
  return fs.readFileSync(file).toString();
}

function reduce() {
  var funcs = _.toArray(arguments);
  var v     = funcs.shift();

  return _.reduce(funcs, function (acc, f) {
    return f(acc);
  }, v);
}


function tag_when_to_object($) {
  let conds = {};
  let $whens = conds.$whens = $('when');
  if (is_empty($whens))
    return {};

  conds.conditions = _.reduce($whens, function (vals, when) {
    return _.extend(vals, when_tag_contents_to_plain_object($, when));
  }, {});

  return conds;
}


function filter_files(dir, pattern) {
  let files = _.map(
    fs.readdirSync(dir),
    function (f) { return path.join(dir, f); }
  );
  return _.filter(files, function (f) { return f.match(pattern); } );
}

function merge_tags(tag) {
  return function _merge_tags_($) {
    var tags = $(tag);
    if (tags.length === 0)
      return $;

    var $first = $($('head').first());
    _.each(tags, function (raw, i) {
      if (i === 0) return;
      var html = $(raw).html();
      $first.append(html);
      $(raw).remove();
    });

    return $;
  };
} // === function merge_tags


function remove_duplicate_tag(tag) {
  return function ($) {
    var tags = $(tag);
    if (is_empty(tags)) return $;
    var cache = [];
    function to_o(raw) {
      return [raw.name, $(raw).attr(), _.trim($(raw).html() || "")];
    }
    _.each(tags, function (raw, i) {
      var o = to_o(raw);
      if (_.find(cache, function (oo) { return _.isEqual(oo, o); })) {
        $(raw).remove();
      } else {
        cache.push(o);
      }
    });
    return $;
  };
} // === function



// ===  "template" tags can be deeply nested,
// so we process the inner-most ones first,
// then move on to the outer ones.
function tag_template_to_script($) {
  let tags = $('template');

  // === If no tags, we are done processing:
  if (tags.length === 0)
    return $;

  // === Find the inner-most (ie nested) template
  // tag and process it:
  let raw = _.find(tags, function (r) {
    return $('template', r).length === 0;
  });

  let type = $(raw).attr('type');
  if (!type || _.trim(type) === '')
    $(raw).attr('type', "application/template");
  let escaped = he.encode(
    $(raw).html() || '', { useNamedReferences: false }
  ).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
  $(raw).text(escaped);

  raw.name = "script";

  // === Recurse to handle outer template tags:
  return tag_template_to_script($);
}


function when_tag_contents_to_plain_object($, raw) {
  return _.reduce($(raw).children(), function (o, child) {
    let name = non_blank_property(child, 'name');
    let val  = reduce(
      grab_attr_or_html($, 'value', child),
      be(is_string),
      be(not(is_length_zero))
    );
    o[name] = val;
    return o;
  }, {});
}

function non_blank_property(o, key) {
  return reduce(o.hasOwnProperty(key), be(is_true)) &&
    reduce(o[key], be(is_string), _.trim, be(not(is_length_zero)));
}


function grab_attr_or_html($, name, raw) {
  return reduce(
    [$(raw).attr(name), $(raw).html()],
    find(is_string, not(is_whitespace)),
    be(is_string),
    _.trim
  );
}

function render_locals($, raw_o) {
  let o = _.reduce($('local, when'), function (o, raw) {
    if (raw.name === 'when') {
      return _.extend(o, when_tag_contents_to_plain_object($, raw));
    }

    let k = reduce($(raw).attr('name'), _.trim, be(not(is_length_zero)));
    let v = reduce($(raw).attr('value'), _.trim, be(not(is_length_zero)));
    o[k] = v;
    $(raw).remove();
    return o;
  }, {});

  let old_o = reduce(raw_o, to_default({}), be(is_plain_object));
  let new_$ = reduce(
    combine(old_o, o),
    Handlebars.compile($.html(), {strict: true}),
    string_to_$
  );

  return new_$;
}


function inspect_$($) {
  log($.html());
  return $;
}


// === NOTE: `cheerio.load` w/ xmlMode: true is not used because it
// will remove </script> in <script ...></script>
function string_to_$(raw_str) {
  let str = be(is_string)(raw_str);
  return cheerio.load(str, {recognizeSelfClosing: true});
}


function error(msg) {
  console.error(msg);
  process.exit(1);
}

function get_comments($_) {
  return _.compact(_.map($_.contents(), function (node) {
    if (node.type === 'comment')
      return node.data;
  }));
}

function get_inline_vars(html) {
  var $ = cheerio(html);
  var attrs = {};
  _.each(get_comments($), function (data) {
    var lines  = data.split("\n");
    var key    = _.trim(lines.shift());
    attrs[key] = _.trim(lines.join("\n"));
  });

  return(attrs);
}

function shift_args(ARGS) {
  if (is_length_zero(ARGS)) {
    console.error("No value given for: " + raw_name);
    process.exit(1);
  }
  return ARGS.shift();
} // function shift_args


