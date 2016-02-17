"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

var $         = require('cheerio');
var _         = require('lodash');
var Hogan     = require('hogan.js');
var fs        = require('fs');
var path      = require('path');
var templates = [];
var layout    = null;
var he        = require('he');
const EXT       = '.template.html';

// === Filter :layout from :templates:
_.each(process.argv, function (raw_file_name, i) {
  if (raw_file_name.indexOf(EXT) < 1)
    return;

  if ('layout' === path.basename(raw_file_name, EXT)) {
    layout = template_to_meta(raw_file_name);
    return;
  }

  templates.push(raw_file_name);
}); // === each contents

// === Something went wrong if there are not templates found:
if (_.isEmpty(templates)) {
  console.error("No " + EXT + " files found.");
  process.exit(1);
}

// === Render templates to html files:
_.each(templates, function (raw_file_name) {
  let meta = template_to_meta(raw_file_name);

  let final_html = (layout) ?
      compiled_to_compiler(layout.code).render(meta.attrs, {markup: compiled_to_compiler(meta.code)}) :
      compiled_to_compiler(meta.code).render(meta.attrs) ;

  let q = $.load(
    final_html, {
      decodeEntities: false // === Prevents &apos; to be used.
                            //     Cheerio sets it to true to fix some other bug.
    }
  );

  let template_tags = q('template');

  _.each(template_tags, function (raw) {
    raw.name = "script";
    let type = ( $(raw).attr() || {}).type;
    if (_.trim(type || '') === '')
      $(raw).attr('type', "application/template");
    $(raw).text(he.encode($(raw).html() || '', {
      useNamedReferences: false
    }));
  });

  console.log(q.html());
});

function template_to_meta(raw_file_name) {
  var string = fs.readFileSync(raw_file_name).toString();
  var name   = path.basename(raw_file_name, '.mustache.html');
  var attrs  = get_attrs(string);

  var mustache = Hogan.compile(string, {asString: 1, delimiters: '[[ ]]'});

  if (!templates[raw_file_name])
    templates[raw_file_name] = {};

  return {
    attrs     : (attrs || {}),
    source    : string,
    code      : mustache,
    file_name : raw_file_name
  };
} // === function template_to_meta


function get_comments(original_html) {
  var html;
  var has_body = original_html.match(/<body/i);

  if (!has_body)
    html = "<html><body>" + original_html + "</body></html>";
  else
    html = original_html;


  return _.compact(_.map($('body', html).contents(), function (node) {
    if (node.type === 'comment')
      return node.data;
  }));
}

function get_attrs(html) {
  var attrs = {};
  _.each(get_comments(html), function (data) {
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

