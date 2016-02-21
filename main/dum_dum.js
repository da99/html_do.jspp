"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const Hogan   = require('hogan.js');
const fs      = require('fs');
const path    = require('path');
const he      = require('he');
const SNIPPET_REUSE_TAGS = ['head', 'tail', 'top', 'bottom'];
const FILES_USED = [];

var args     = process.argv.slice(2);
var dir      = args.pop() || error('!!! Output dir not specified.');
var template = args.pop() || error('!!! Template not specified.');
var layout   = args.pop();

var name              = path.basename(template, '.html');
var template_contents = read_and_cache_file_name(template);
var layout_contents   = fs.readFileSync(layout).toString();
var $layout           = layout && cheerio.load(layout_contents);
var $template         = cheerio.load(template_contents);

$template = var_pipeline(
  $template,
  scripts_to_tag,
  styles_to_tag,
  markup_to_file,
  to_func(merge_with_layout, $layout)
);

// === Finish writing file.
var page_file_path = ABOUT('new-file', name + '.html');
fs.writeFileSync(page_file_path, $template.to_html());
log(page_file_path);


function ABOUT(key) { // === Function that returns state.
  switch (key) {
    case 'name':
      return name;
    case 'dir':
      return dir;
    case 'new-file':
      return dir + '/page-' + name + '-' + arguments[1];
    case 'layout':
      return $layout;
    default:
      error("!!! Unknown key: " + key);
  }
}


function merge_with_layout($layout, $template) {
  if (!ABOUT('layout'))
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

// ===  "template" tags can be deeply nested,
// so we process the inner-most ones first,
// then move on to the outer ones.
function tag_template_to_script(html) {
  let $    = cheerio.load(html);
  let tags = $('template');

  // === If no tags, we are done processing:
  if (tags.length === 0)
    return html;

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
  return tag_template_to_script($.html());
}

function styles_to_tag($) {
  var rel_path = ABOUT('new-file', 'style.css');
  var contents = to_html_and_remove($, $('style'));
  fs.writeFileSync(rel_path, contents);

  return append_to_tag(
    'head',
    $,
    '<link rel="stylesheet" type="text/css" href="' + rel_path + '" />'
  );
}

function scripts_to_tag($) {
  var rel_path = ABOUT('new-file', 'script.js');
  var contents = to_html_and_remove($, $('script'));

  fs.writeFileSync(rel_path, contents);

  return append_to_tag(
    'bottom',
    $,
    '<script type="application/javascript" src="' + rel_path  + '"></script>'
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
    $('<' + tag_name + '></' + tag_name + '>').appendTo($);
    target = $(tag_name);
  }
  target.append(html);
  return $;
} // === append_to_tag

function markup_to_file($) {
  fs.writeFileSync(
    ABOUT('new-file', 'markup.html'),
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

function to_func() {
  var args = _.toArray(arguments);
  var func = args.shift();

  return function () {
    return func.apply(null, [].concat(args).concat(arguments));
  };
}



