"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const Hogan   = require('hogan.js');
const fs      = require('fs');
const path    = require('path');
const he      = require('he');
const EXT     = '.template.html';

var template;
var layout;

// === Filter :layout from :templates:
_.each(process.argv, function (raw_file_name, i) {
  if (raw_file_name.indexOf(EXT) < 1)
    return;

  if ('layout' === path.basename(raw_file_name, EXT)) {
    layout = raw_file_name;
    return;
  }

  if (!template) {
    template = raw_file_name;
    return;
  }

  console.error("!!! Too many templates: " + raw_file_name);
  process.exit(1);
}); // === each contents

// === Something went wrong if there are not templates found:
if (!template) {
  console.error("No " + EXT + " files found.");
  process.exit(1);
}

var raw_html        = fs.readFileSync(template).toString();
var name            = path.basename(template, '.mustache.html');
var mustache        = to_mustache(raw_html);
var inline_vars     = {};

var layout_html     = layout && fs.readFileSync(layout).toString();
var layout_mustache = layout && to_mustache(layout_html);

if (layout_html)
  inline_vars = _.extend(inline_vars, get_inline_vars(layout_html));
inline_vars = _.extend(inline_vars, get_inline_vars(raw_html));

var final_html;
if (layout)
  final_html = compiled_to_compiler(layout_mustache).render(inline_vars, {markup: compiled_to_compiler(mustache)});
else
  final_html = compiled_to_compiler(mustache).render(inline_vars) ;

final_html = tag_template_to_script(final_html);
console.log(final_html);

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


