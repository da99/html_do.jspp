"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

var $         = require('cheerio');
var _         = require('lodash');
var Hogan     = require('hogan.js');
var fs        = require('fs');
var path      = require('path');
var templates = {};
var layout    = null;
var he        = require('he');

_.each(process.argv, function (raw_file_name, i) {
  if (raw_file_name.indexOf('.mustache.html') < 1)
    return;
  var string = fs.readFileSync(raw_file_name).toString();
  var pieces = raw_file_name.split('/');
  var dir    = pieces[pieces.length-2];
  var raw    = pieces[pieces.length-1].split('.');
  raw.pop();
  var name   = raw.join('.');
  var attrs = get_attrs(string);

  var mustache = Hogan.compile(string, {asString: 1, delimiters: '[[ ]]'});

  if (!templates[dir])
    templates[dir] = {};

  if (!templates[dir][name])
    templates[dir][name] = {};
  templates[dir][name] = _.extend(
    templates[dir][name],
    {
      attrs     : (attrs || {}),
      dir       : dir,
      source    : string,
      name      : name,
      code      : mustache,
      file_name : raw_file_name
    }
  );

  if (name === 'layout')
    layout = templates[dir][name];
}); // === each contents

if (_.isEmpty(templates)) {
  console.error("No .mustache.html files found.");
  process.exit(1);
}

// var new_files = [];
// === Render templates to html files:
_.each(templates, function (files) {
  _.each(files, function (meta, name) {
    if (name === 'layout')
      return;

    var final_html = (layout) ?
        compiled_to_compiler(layout.code).render(meta.attrs, {markup: compiled_to_compiler(meta.code)}) :
        compiled_to_compiler(meta.code).render(meta.attrs) ;

    var q = $.load(
      final_html, {
        decodeEntities: false // === Prevents &apos; to be used.
                              //     Cheerio sets it to true to fix some other bug.
      }
    );

    let mustaches = q('mustache');

    _.each(mustaches, function (raw) {
      raw.name = "script";
      $(raw).attr('type', "text/mustache");
      $(raw).text(he.encode($(raw).html() || ''));
    });

    console.log(q.html());
  });
});


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

