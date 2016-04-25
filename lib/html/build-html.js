"use strict";
/* jshint node: true, esnext: true, globalstrict: true, undef: true */
/* global console, require, process  */
/* global be, not, is_string, log, combine, is_blank_string, is_file, replace, is_something  */
/* global reduce, to_var_name, read_key, to_array */
/* global is_undefined, is_function, is_plain_object */
/* global to_slot, each_x, is_length_zero, to_string, is_dir, is_empty */
/* global is_true, is_whitespace, to_default, is_plain_object, find */
/* global create_key, update_key, describe_reduce, length */
/* global describe_reduce, reduce_eachs, eachs, create_or_update_key */

const _                       = require('lodash');
const cheerio                 = require('cheerio');
const Handlebars              = require('handlebars');
const fs                      = require('fs');
const util                    = require('util');
const path                    = require('path');
const he                      = require('he');
const FILES_USED              = [];
const CHILD_PROCESS           = require("child_process");
const INVALID_FILE_NAME_CHARS = /[^a-zA-Z-0-9\_\.\-]+/g;

const PATTERN_FOR_RELATED_FILES = '.+?\.(css|js|png|gif|jpg)$';

const ARGS       = process.argv.slice(2);
const ARGS_NAMED = {"templates": []};

_.extend(global, require("../node/build/node"));

function log_error() {
  return console.error.apply(console, arguments);
}

switch (ARGS.length) {

  case 3:
    ARGS_NAMED.public_dir = describe_reduce(
      "Getting public dir",
      ARGS.pop(),
      path.resolve,
      be(is_dir)
    );

    ARGS_NAMED.output_dir = describe_reduce(
      "Getting output dir",
      ARGS.pop(),
      path.resolve,
      be(is_dir)
    );

    if (is_file(_.last(ARGS))) {
      ARGS_NAMED.templates = [ARGS.pop()];
      break;
    }

    ARGS_NAMED.input_dir = describe_reduce(
      "Getting input dir",
      ARGS.pop(),
      path.resolve,
      be(is_dir)
    );

    ARGS_NAMED.templates = ARGS_NAMED
    .templates
    .slice(0)
    .concat(
      CHILD_PROCESS.execFileSync("find", [ARGS_NAMED.input_dir, "-type", "f", "-name", "_*", "-prune", "-o", "-name", "*.html", "-print"])
      .toString()
      .trim()
      .split("\n")
    );
    break;

  default:
    log_error("!!! Unknown options: " + to_string(process.argv));
    process.exit(1);
} // === switch

const INPUT_DIR  = describe_reduce("Input dir",  ARGS_NAMED.input_dir,  path.resolve, be(is_dir));
const OUTPUT_DIR = describe_reduce("Output dir", ARGS_NAMED.output_dir, path.resolve, be(is_dir));
const PUBLIC_DIR = describe_reduce("Public dir", ARGS_NAMED.public_dir, path.resolve, be(is_string), _.trim, be(not(is_length_zero)));
const TEMPLATES  = ARGS_NAMED.templates;


each_x(TEMPLATES, function _each_x_templates_(filename) {
  if (reduce(filename, _.trim, is_empty))
    return;

  var TEMPLATE = new Template(filename);

  if (is_partial(read_key(TEMPLATE, 'full_path'))) {
    log_error('!!! Template is a partial: ' + filename);
    process.exit(1);
  }

  reduce(
    TEMPLATE,
    reduce_template_as_partial,
    reduce_tags_script,
    reduce_tags_top_bottom_around_body,
    template_to_file
  );
}); // === each_x TEMPLATES

// ============================================================================
// === Finish writing file. ===================================================
// ============================================================================

function reduce_template_as_partial(TEMPLATE) {

  return reduce(
    TEMPLATE,

    file_system_to_locals,

    reduce_tags_local,
    reduce_tags_global,

    reduce_tags_to_global,

    reduce_tags_run_to_script,
    reduce_tags_run,

    reduce_tags_style,
    reduce_tags_template,

    reduce_tags_top_bottom_id,

    // Merging tags/elements should happend
    // after template/script tags have been
    // (ie HTML escaped).
    // Or else tags in templates end up outside
    // the template/script tag.
    merge_tags('head'),
    merge_tags('tail'),
    merge_tags('body'),
    merge_tags('top'),
    merge_tags('bottom'),

    remove_duplicate_tag('link'),
    remove_duplicate_tag('script'),
    remove_duplicate_tag('meta')

    // reduce_tags_head_tail_positions
  );

} // === function reduce_template_as_partial

function is_cheerio(o) {
  return is_function(o) && o.toString().indexOf('Cheerio') > 1;
}

function write_conditions_js(TEMPLATE) {
  // === Get new conditions:
  let new_conds = tag_when_to_object(TEMPLATE.$);

  if (is_empty(new_conds))
    return TEMPLATE;

  // === Read:
  var conds = read_conds(TEMPLATE);

  const KEY = reduce(
    TEMPLATE.full_path,
    path_to_name,
    to_slot(to_var_name, '{{_}}', '.')
  );

  // === Merge:
  conds[KEY] = new_conds.conditions;

  // === Write:
  write_new_file(json_file_path(), JSON.stringify(conds, null, '  '));

  new_conds.$whens.remove();

  return TEMPLATE;
} // === write_conditions_js

function public_url(file) {
  var public_dir = path.resolve(PUBLIC_DIR);
  var full       = path.resolve(file);
  var fin        = path.join( '/', path.relative(public_dir, full) );
  return fin;
}

function reduce_tags_style(TEMPLATE) {
  const $        = TEMPLATE.$;
  const NEW_PATH = new_file_name_alongside_template(TEMPLATE, 'style.css');
  var contents   = map_to_html_and_remove($, $('style'));

  if (is_blank_string(contents))
    return TEMPLATE;

  write_new_file(NEW_PATH, contents);

  append_to_tag(
    'head',
    $,
    '<link rel="stylesheet" type="text/css" href="' + public_url(NEW_PATH) + '" />'
  );

  return TEMPLATE;
}

function reduce_tags_script(TEMPLATE) {
  const $ = TEMPLATE.$;

  const NEW_PATH = new_file_name_alongside_template(TEMPLATE, 'script.js');

  let scripts  = _.filter( $('script'), function (raw) {
    const ELE  = $(raw);
    const TYPE = ELE.attr("type") || "";
    const SRC  = ELE.attr("src")  || "";
    return (
      is_blank_string(TYPE) || TYPE.indexOf("javascript") > 4
    ) && is_blank_string(SRC);
  });

  const SCRIPT_BODY = reduce_eachs([], scripts, function (arr, _i, raw) {
    const ELE = $(raw);
    arr.push(ELE.html());
    ELE.remove();
    return arr;
  }).join("\n");

  if (is_blank_string(SCRIPT_BODY))
    return TEMPLATE;

  const SCRIPT_HEAD = "/* jshint browser: true, undef: true */\n";
  write_new_file(NEW_PATH, SCRIPT_HEAD + SCRIPT_BODY);

  const BOTTOM = $('<bottom></bottom>');
  BOTTOM.html(
    '<script type="application/javascript" src="' + public_url(NEW_PATH)  + '"></script>'
  );
  $.root().append(BOTTOM);

  return TEMPLATE;
} // === scripts_to_tag

function read_conds(TEMPLATE) {
  const JSON_FILE = json_file_path();

  if (!is_file(JSON_FILE))
    return {};

  var raw = fs.readFileSync(JSON_FILE).toString();

  if (is_blank_string(raw))
    return {};

  return JSON.parse(raw);
}

function template_to_file(TEMPLATE) {
  write_new_file(
    new_file_name_alongside_template(TEMPLATE, 'html'),
    template_to_html(TEMPLATE)
  );

  return TEMPLATE;
}

function template_to_html(TEMPLATE) {
  const HTML = read_key(TEMPLATE, '$').html();
  return describe_reduce(
    "Rendering " + TEMPLATE.full_path ,
    combine(
      read_key(TEMPLATE, 'globals'),
      read_key(TEMPLATE, 'locals')
    ),
    to_slot(render_handlebars, HTML, '{{_}}'),
    _.trim
  );
} // === template_to_html

function render_handlebars(str, vars) {
  let prev;
  let curr = str;

  while (prev !== curr) {
    prev = curr;
    curr = Handlebars.compile(curr, {strict: true})(vars);
  }

  return prev;
}


function trim_end_semi_colon (str) {
  return _.trimEnd(str, ';');
}

/* These are tags that have no attributes, only content:
*  <run>my-command</run>
*  ->
*  <script type="application/data-do" data-do="my-command"></script>
* */
function reduce_tags_run_to_script(TEMPLATE) {
  const $ = read_key(TEMPLATE, '$');

  each_x($('run'), function (raw) {
    const HTML = $(raw).html();
    const SRC = $(raw).attr('src');

    if (is_empty(HTML) || is_nothing(HTML) || !is_nothing(SRC))
      return;

    const DATA_DO = _.trim(HTML)
    .split("\n")
    .map(trim_end_semi_colon)
    .map(_.trim)
    .join("; ") + ';';

    const NEW_SCRIPT = $('<script></script>');
    NEW_SCRIPT.attr('type', 'application/data-do');
    NEW_SCRIPT.attr('data-do', DATA_DO);
    $(raw).replaceWith(NEW_SCRIPT);
  });

  return TEMPLATE;
} // === reduce_tags_run_to_script

function reduce_tags_run(TEMPLATE) {
  const $ = read_key(TEMPLATE, '$');

  each_x($('run'), function (raw) {

    const src = describe_reduce(
      "SRC attribute of RUN tag",
      $(raw).attr('src'),
      be(is_string),
      _.trim,
      be(not(is_length_zero))
    );

    const RUN_HTML = $(raw).html() || "";

    const fullpath_src = path.join(
      path.dirname(
        read_key(TEMPLATE, 'full_path')
      ),
      src
    );

    const PARTIAL = reduce(
      new Template(fullpath_src, read_key(TEMPLATE, 'globals'), RUN_HTML),
      reduce_template_as_partial,
      template_to_html
    );

    $(raw).replaceWith(PARTIAL);
  });

  return TEMPLATE;
} // === function tag_run_to_markup

function read_file_relative_to_template(TEMPLATE, file_path) {
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
    path.join(path.dirname(TEMPLATE.full_path), file_path),
    path.join(path.dirname(new_file_name_alongside_template(TEMPLATE, '')), file_path)
  ];
  var efforts = paths.slice(0);

  while (!is_string(contents) && !is_empty(paths)) {
    contents = read(paths.shift());
  }

  if (contents)
    return contents;

  log_error('!!! File not found: ' + file_path + ' in: ' + to_string(efforts));
  process.exit(1);
} // === function read_file


function file_system_to_locals(TEMPLATE) {
  const TEMPLATE_DIR = path.dirname(TEMPLATE.full_path);

  let files = shell_find(
    TEMPLATE_DIR, "-type", "f", "-regextype", "posix-extended", "-regex", PATTERN_FOR_RELATED_FILES, "-print"
  );

  const  vars = reduce_eachs(
    read_key(TEMPLATE, 'locals'),
    files,
    function (vars, _i, raw_path) {
      const DIR_STRUCTURE             = path.relative(INPUT_DIR, TEMPLATE_DIR);
      const FILE_RELATIVE_TO_TEMPLATE = path.relative(TEMPLATE_DIR, raw_path);
      const FULL_PATH                 = path.join(
        OUTPUT_DIR, DIR_STRUCTURE, FILE_RELATIVE_TO_TEMPLATE
      );

      const PUBLIC_URL = public_url(FULL_PATH);
      const KEY        = to_var_name(FILE_RELATIVE_TO_TEMPLATE);

      if (vars[KEY] === PUBLIC_URL)
        return vars;

      return create_key( vars, KEY, PUBLIC_URL );
    }
  ); // ==== vars

  return update_key(TEMPLATE, "locals", vars);
} // === function copy_files_to_public


function copy_files_to_public(IN, OUT) {
  let files = shell_find(IN, "-type", "f", "-regextype", "posix-extended",  "-regex", PATTERN_FOR_RELATED_FILES, "-print");
  let dirs  = [];

  each_x(files, function (x) {
    let d = path.dirname(x).replace(IN, "");
    if ( d !== '/' && d !== '' )
      return dirs.push(path.join(OUT, d));
  });

  // === Re-create dir structur in OUT for files to be copied:
  if (!is_empty(dirs)) {
    mkdir_p(dirs);
  }

  _.each(files, function (orig) {
    let new_path  = path.join(OUT, orig.replace(IN, ""));
    fs.writeFileSync(new_path, fs.readFileSync(orig));
  });

  return files;
} // === function copy_files_to_public


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

function merge_tags(name) {
  return function _merge_tags_(TEMPLATE) {
    const $      = read_key(TEMPLATE, '$');
    const TAGS   = $(name);
    const $first = $($(name).first());

    eachs(TAGS, function (i, raw) {
      if (i === 0)
        return;

      const ele = $(raw);
      var html = ele.html();
      $first.append(html);
      ele.remove();
    });

    return TEMPLATE;
  };
} // === function merge_tags


function remove_duplicate_tag(name) {
  return function (TEMPLATE) {
    const $     = read_key(TEMPLATE, '$');
    const tags  = $(name);
    const cache = [];

    if (is_empty(tags))
      return TEMPLATE;

    each_x(tags, function (raw) {
      var o = [raw.name, $(raw).attr(), _.trim($(raw).html() || "")];
      if (_.find(cache, function (oo) { return _.isEqual(oo, o); })) {
        $(raw).remove();
      } else {
        cache.push(o);
      }
    });
    return TEMPLATE;
  };
} // === function



// ===  "template" tags can be deeply nested,
// so we process the inner-most ones first,
// then move on to the outer ones.
function reduce_tags_template(TEMPLATE) {
  const $    = TEMPLATE.$;
  const TAGS = $('template');

  // === If no tags, we are done processing:
  if (TAGS.length === 0)
    return TEMPLATE;

  // === Find the inner-most (ie nested) template
  // tag and process it:
  let raw = _.find(TAGS, function (r) {
    return $('template', r).length === 0;
  });

  const type = $(raw).attr('type');

  if (!type || _.trim(type) === '')
    $(raw).attr('type', "application/template");

  const escaped = he.encode(
    $(raw).html() || '', { useNamedReferences: false }
  )
  .replace(/(\\)?\{/g, '&#123;')
    .replace(/\}/g, '&#125;');

  $(raw).text(escaped);

  raw.name = "script";

  // === Recurse to handle outer template tags:
  return reduce_tags_template(TEMPLATE);
} // === function tag_template_to_script


function reduce_tags_top_bottom_around_body(TEMPLATE) {
  const $ = read_key(TEMPLATE, '$');
  if (is_empty($('body')))
    return TEMPLATE;

  each_x(
    $.root().children('top, bottom'),
    function (raw) {
      if ($(raw).id)
        return;

      const ELE = $(raw);
      const HTML = $(ELE.html());

      if (raw.name === 'top')
        HTML.insertBefore('body');
      else
        $('html').append(HTML);

      ELE.remove();
    }
  ); // === each_x

  return TEMPLATE;
} // === function

function reduce_tags_top_bottom_id(TEMPLATE) {
  const $ = read_key(TEMPLATE, '$');
  each_x(
    $.root().children('top[to], bottom[to]'),
    function (raw) {
      const ID     = $(raw).attr('to');
      const TARGET = $('#' + ID);
      const ACTION = raw.name.toLowerCase();

      if (is_empty(TARGET))
        throw new Error('Element #' + ID + ' was not found.');

      if (ACTION === 'top')
        $(TARGET).prepend($(raw).html());
      else
        $(TARGET).append($(raw).html());

      $(raw).remove();
    }
  ); // === each_x

  return TEMPLATE;
} // === function reduce_tags_top_bottom_id

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

function reduce_tags_local(TEMPLATE) {
  const FULL_PATH = TEMPLATE.full_path;
  const $         = TEMPLATE.$;
  const GLOBALS   = read_key(TEMPLATE, 'globals');
  const LOCALS    = read_key(TEMPLATE, 'locals');

  const NEW_LOCALS = reduce_eachs(
    LOCALS,
    $.root().children('local'),
    function (o, _i, raw) {
      if (raw.name === 'when') {
        return _.extend(o, when_tag_contents_to_plain_object($, raw));
      }

      const kv = tag_to_var(TEMPLATE, raw);
      const k  = kv.name;
      const v  = kv.value;

      $(raw).remove();
      if (GLOBALS.hasOwnProperty(k))
        throw new Error("!!! LOCAL value already defined as GLOBAL: " + to_string(k));
      return create_key(o, k, v);
    }
  );

  return update_key(
    TEMPLATE,
    'locals',
    NEW_LOCALS
  );
} // === function render_locals

function reduce_tags_global(TEMPLATE) {

  const $ = TEMPLATE.$;

  const KV = reduce_eachs(
    read_key(TEMPLATE, 'globals'),
    TEMPLATE.$.root().children('global'),
    function (o, _i, raw) {
      let kv, new_o, from = $(raw).attr('from');

      if (from) {
        let value = describe_reduce(
          "Turning LOCAL to GLOBAL",
          from,
          to_slot(read_key, TEMPLATE.locals, '{{_}}')
        );
        new_o = create_key(o, from, value);
      } else {
        kv = tag_to_var(TEMPLATE, raw);
        new_o = create_key(o, kv.name, kv.value);
      }

      TEMPLATE.$(raw).remove();
      return new_o;
    }
  );

  return update_key(TEMPLATE, 'globals', KV);
} // === function update_with_globals

function reduce_tags_to_global(TEMPLATE) {
  const $          = TEMPLATE.$;
  const GLOBALS    = read_key(TEMPLATE, 'globals');
  const LOCALS     = read_key(TEMPLATE, 'locals');
  const TO_GLOBALS = $.root().children('to-global');

  const NEW_GLOBALS = reduce_eachs(GLOBALS, TO_GLOBALS, function (o, _i, raw) {
    const NAME = $(raw).attr('name');
    if (!LOCALS.hasOwnProperty(NAME))
      throw new Error("to-global: local not found: " + NAME);
    $(raw).remove();
    return create_key(o, NAME, read_key(LOCALS, NAME));
  }); // === reduce_eachs

  return update_key(TEMPLATE, 'globals', NEW_GLOBALS);
} // === function

function inspect_template(t) {
  log_error(t.$.html());
  return t;
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
  log_error(msg);
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

// shift: --name  value
function shift_named_args(ARGS, for_name) {
  if (is_length_zero(ARGS)) {
    log_error("No value given for: " + for_name);
    process.exit(1);
  }
  return ARGS.shift();
} // function shift_named_args

function shell_find() {
  let raw = CHILD_PROCESS.execFileSync("find", to_array(arguments))
  .toString()
  .trim()
  .split("\n");

  let fin = [];

  each_x(raw, function (x) {
    if (!is_empty(x))
      fin.push(x);
  });

  return fin;
} // === shell_find


function mkdir_p(_args) {
  const DIRS = _.flattenDeep(to_array(arguments));
  return CHILD_PROCESS.execFileSync("mkdir", ["-p"].concat(DIRS));
}


function write_new_file(new_path, content) {

  let full     = path.resolve(new_path);
  let relative = path.relative(OUTPUT_DIR, full);
  let input    = path.join(INPUT_DIR, relative);

  if (!full.match(/\.html$/) && is_file(input)) {
    log_error("!!! Already exists in INPUT directory: " + input);
    process.exit(1);
  }

  mkdir_p(path.dirname(full));
  fs.writeFileSync(full, content);
  log(new_path);
  return full;
} // === function write_new_file

function template_to_name(template) {
  return path.basename(template.full_path, path.extname(template.full_path));
}

function new_file_name_alongside_template(template, new_file_name) {

  const DIR_STRUCTURE = path.relative(INPUT_DIR, path.dirname(template.full_path));
  const PREFIX        = template_to_name(template);
  const NEW_BASE_NAME = to_var_name(PREFIX + '.' + new_file_name, '.');

  return path.join(
    OUTPUT_DIR, DIR_STRUCTURE, NEW_BASE_NAME
  );

} // === function new_file_name_alongside_template

function is_partial(filename) {
  return path.basename(filename).match(/^_+\./);
}

function path_to_name(raw_path) {
  return path.basename(raw_path, path.extname(raw_path));
}

function json_file_path() {
  return path.join(OUTPUT_DIR, "conditions.json");
}

function Template(raw_path, _args) {
  const ARGS = to_array(arguments).slice(1);
  var   IMPORT_GLOBALS = {};
  const IMPORT_HTML    = [];

  // === Import objects (key-value) and strings (HTML):
  while (length(ARGS) > 0) {
    if (is_string(ARGS[0]))
      IMPORT_HTML.push(ARGS[0]);
    else {
      if (is_plain_object(ARGS[0]))
        IMPORT_GLOBALS = combine(IMPORT_GLOBALS, ARGS[0]);
      else
        throw new Error("Unknown type to import into template: " + to_string(ARGS[0]));
    }
    ARGS.shift();
  }

  const FULL_PATH = path.resolve(raw_path);

  IMPORT_HTML.push( read_and_cache_file_name(FULL_PATH) );
  const CONTENT   = IMPORT_HTML.join("\n");

  var THE_TEMPLATE = {
    full_path: FULL_PATH,
    globals:   IMPORT_GLOBALS,
    locals:    {},
    $:         string_to_$(CONTENT),
    tags:      []
  };

  return THE_TEMPLATE;
} // === function Template

// === This function requires a TEMPLATE in case the tag has
// === a value stored in a file (eg config file to stay DRY).
function tag_to_var(TEMPLATE, raw_ele) {
  const raw = TEMPLATE.$(raw_ele);
  const name = reduce(raw.attr('name'), _.trim, be(not(is_length_zero)));
  let raw_value = raw.attr('value');
  let raw_file  = raw.attr('file');

  if (raw_file) {
    raw_value = read_file_relative_to_template(TEMPLATE, raw_file);
  } else {
    if (!raw_value)
      raw_value = raw.html();
  }
  const v = reduce(raw_value, _.trim, be(not(is_length_zero)));

  return {name: name, value: v};
} // === function

function shift_tags(tags, name) {
  const FIN = [];
  var counter = 0;

  while (tags[counter] && tags[counter].name.trim().toLowerCase() === name) {
    FIN.push(tags[counter]);
    counter = counter + 1;
  }

  return FIN;
} // === function


