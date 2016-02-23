"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const Hogan   = require('hogan.js');
const fs      = require('fs');
const util    = require('util');
const path    = require('path');
const he      = require('he');
const SNIPPET_REUSE_TAGS = ['head', 'tail', 'top', 'bottom'];
const FILES_USED = [];

var args     = process.argv.slice(2);

switch (args.length) {
  case 3: break;
  case 4: break;
  default:
    console.error(to_string(args));
    console.error("!!! arguments.length incorrect. Try: [layout]  template_file  output_dir  public_path");
    process.exit(1);
}

var public_dir=args.pop();
var dir      = args.pop();
var template = args.pop();
var layout   = args.pop();

should_be(public_dir, is_string);
should_be(dir,        is_dir);
should_be(template,   is_file);
if (layout)
  should_be(layout,  is_file);

var name              = path.basename(template, '.html');
var template_contents = read_and_cache_file_name(template);
var layout_contents   = layout && fs.readFileSync(layout).toString();
var $layout           = layout && cheerio.load(layout_contents, {recognizeSelfClosing: true});
var $template         = cheerio.load(template_contents, {recognizeSelfClosing: true});
var has_conditionals  = $template('when').length > 0;
$template = var_pipeline(
  $template,
  scripts_to_tag,
  styles_to_tag,
  tag_template_to_script,
  conditionals_to_files,
  markup_to_file,
  layout ? to_func(merge_with_layout, $layout) : identity
);

// === Finish writing file.
if (layout) {
  var page_file_path = ABOUT('new-file', '.html');
  fs.writeFileSync(page_file_path, $template.html());
  log(page_file_path);
}


function ABOUT(key) { // === Function that returns state.
  switch (key) {
    case 'name':
      return name;
    case 'dir':
      return dir;
    case 'new-file':
      return dir + '/' + name + '-' + arguments[1];
    case 'public-dir':
      return public_dir;
    case 'has-conditionals':
      return has_conditionals;
    case 'json-file':
      return path.join(ABOUT('dir'), "conditions.json");
    case 'layout':
      return $layout;
    default:
      error("!!! Unknown key: " + key);
  }
}


function merge_with_layout($layout, $template) {
    log(arguments[1].html);
  if (!$layout)
    log(arguments.length, $template.html);
  if (!$layout)
    return $template;
  if ($template('html').length === 0)
    return $template;

  _.each($template.children(), function (raw) {
    switch (raw.name) {
      case 'head':
        $layout('head').append($template(raw).html());
        $template(raw).remove();
        break;

      case 'tail':
        $layout('body').after($template(raw).html());
        $template(raw).remove();
        break;

      case 'top':
        $layout('body').prepend($template(raw).html());
        $template(raw).remove();
        break;

      case 'bottom':
        $layout('body').append($template(raw).html());
        $template(raw).remove();
        break;
    } // == switch
  });

  $layout('markup').replaceWith($template.html());
  return $layout;
} // === merge_markup

function conditionals_to_files($) {
  _.each($('when'), function (raw_when) {
    var name = var_pipeline(
      $(raw_when).attr('name'),
      to_func_first(should_be, is_non_blank_string),
      _.trim
    );

    merge_and_write_conds(tag_when_to_object($, raw_when));
    $(raw_when).remove();

    var $no_whens = $.load($.html());
    $no_whens('when').remove();

    fs.writeFileSync(
      ABOUT('new-file', (is_partial($)) ? 'markup.' : '.') + name + '.html',
      $no_whens.html()
    );
  });

  return $;
} // === conditionals_to_files

function error(msg) {
  console.error(msg);
  process.exit(1);
}

function to_mustache(html) {
  return Hogan.compile(html, {asString: 1, delimiters: '[[ ]]'});
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

function compiled_to_compiler(code) {
  var f = new Function('Hogan', 'return new Hogan.Template(' + code + ');' );
  return f(Hogan);
}

function cheerio_to_mustache_to_html($) {
  var mustache        = to_mustache($.html());
  var inline_vars     = _.extend({}, get_inline_vars($.html()));

  return tag_template_to_script(
    compiled_to_compiler(mustache).render(inline_vars)
  );
} // === mustache_to_html


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
  let escaped = he.encode($(raw).html() || '', { useNamedReferences: false });
  $(raw).text(escaped);

  raw.name = "script";

  // === Recurse to handle outer template tags:
  return tag_template_to_script($);
}

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
  var contents = to_html_and_remove($, $('style'));

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
  var contents = to_html_and_remove($, $('script'));

  if (is_blank_string(contents))
    return $;

  fs.writeFileSync(new_path, contents);

  return append_to_tag(
    'bottom',
    $,
    '<script type="application/javascript" src="' + rel_path(new_path)  + '"></script>'
  );
} // === scripts_to_tag

function to_html_and_remove($, coll) {
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

function markup_to_file($) {
  if (ABOUT('has-conditionals'))
    return $;

  fs.writeFileSync(
    ABOUT('new-file', (is_partial($)) ? 'markup.html' : '.html'),
    $.html()
  );
  return $;
}

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

function var_pipeline() {
  var funcs = _.toArray(arguments);
  var v     = funcs.shift();

  return _.reduce(funcs, function (acc, f) {
    return f(acc);
  }, v);
}

function log(_args) {
  return console.log.apply(console, arguments);
}

function log_and_return(v) {
  log(v);
  return v;
}

function to_func_first() {
  var args = _.toArray(arguments);
  var func = args.shift();

  return function () {
    return func.apply( null, _.toArray(arguments).concat(args));
  };
}

function to_func() {
  var args = _.toArray(arguments);
  var func = args.shift();

  return function () {
    return func.apply(
      null,
      [].concat(args).concat(_.toArray(arguments))
    );
  };
}


function read_conds() {
  var file = ABOUT('json-file');
  if (!is_file(file))
    return {};
  var raw = fs.readFileSync(file).toString();
  if (is_blank_string(raw))
    return {};
  return JSON.parse(raw);
}

function merge_and_write_conds(new_conds) {
  var conds = read_conds();
  if (!conds[ABOUT('name')])
    conds[ABOUT('name')] = [];
  conds[ABOUT('name')].push(new_conds);
  fs.writeFileSync(ABOUT('json-file'), JSON.stringify(conds));
}

function tag_when_to_object($, raw) {
  return _.reduce($('val', raw), function (acc, raw_val) {
    var name = var_pipeline(
      $(raw_val).attr('name'),
      to_func_first(should_be, is_string),
      _.trim
    );

    var val  = var_pipeline(
      $(raw_val).attr('val'),
      to_func_first(should_be, is_string),
      _.trim
    );

    should_be(acc[name], is_null_or_undefined);
    acc[name] = val;
  }, {});
}

function should_be(val, _funcs) {
  _funcs = _.toArray(arguments);
  val    = _funcs.shift();

  _.each(_funcs, function (f) {
    if (!f(val)) {
      console.error("!!! " + to_string(val) + ' should be: ' + to_string(f));
      process.exit(1);
    }
  });

  return val;
}

function to_string(v) {
  if (v === undefined)
    return 'undefined';
  if (v === null)
    return 'null';
  if (v === false)
    return 'false';
  if (v === true)
    return 'true';
  if (_.isFunction(v))
    return (v.name) ? v.name + ' (function)' : v.toString();
  if (_.isString(v))
    return '"' + v + '"';
  if (_.isArray(v))
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (Array)';
  if (v.constructor === arguments.constructor)
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (arguments)';
  return util.inspect(v);
}

function is_string(v) { return _.isString(v); }
function is_dir(v) { try { return fs.lstatSync(v).isDirectory(); } catch (e) { return false; } }
function is_file(v) { try { return fs.lstatSync(v).isFile(); } catch (e) { return false; } }
function is_blank_string(str) { return _.trim(str).length === 0; }
function is_non_blank_string(str) { return is_string(str) && !is_blank_string(str); }
function identity(v) { return v; }
function is_null_or_undefined(v) { return v === null || v === undefined; }
function is_partial($) { return $('html').length === 0; }



