"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

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

var script_js = section_to_file('script', $, 'script.js');
var style_css = section_to_file('style',  $, 'style.css');
fs.writeFileSync(ABOUT('new-file', 'markup.html'), $.html());

function ABOUT(key) {
  switch (key) {
    case 'name':
      return name;
    case 'dir':
      return dir;
    case 'new-file':
      return dir + '/page-' + name + '-' + arguments[1];
    default:
      error("!!! Unknown key: " + key);
  }
}

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

_.each($layout('file'), function (raw) {
  if (_.isEmpty($layout(raw).attr())) {
    $layout(raw).replace($template);
    return true;
  }
});

log(process_file_tags($layout).html());

function log(_args) {
  return console.log.apply(console, arguments);
}

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

function process_file_tags($) {
  var tags = $('file');
  if (tags.length === 0)
    return $;
  _.each(tags, function (raw) {
    var src = _.trim($(raw).attr('src') || '');
    if (_.isEmpty(src)) {
      console.error('!!! No src for file tags');
      process.exit(1);
    }
    var new$ = cheerio.load(fs.readFileSync(src));
    $(raw).replace(new$);
  });

  return process_file_tags(4);
}

function log(_args) {
  return console.log.apply(console, arguments);
}

function section_to_file(tag, $, file_name) {
  var targets = $(tag);

  if (targets.length === 0)
    return false;

  if (targets.length > 1) {
    console.error("!!! Too many tags for: " + tag);
    process.exit(1);
  }

  var target = targets[0];
  var contents = $(target).html();
  $(target).remove();
  fs.writeFileSync(ABOUT('new-file', file_name), contents.replace(/^\n/, ""));
  return true;
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



