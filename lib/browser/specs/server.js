"use strict";
/* jshint node: true, esnext: true, globalstrict: true, strict: true, undef: true, unused: true */
/* globals console, require, process */

const ARGS         = process.argv.slice(2);

const HTML_FILE    = ARGS[0];
const PUBLIC_DIR   = ARGS[1];
const JS_FILES     = ARGS.slice(2);


const PATH         = require('path');
const FS           = require('fs');
const app          = require('express')();
const serve_static = require('serve-static')(PATH.resolve(PUBLIC_DIR));
const port         = parseInt(process.env.PORT);
const logger       = require('morgan')('dev');
const bodyParser   = require('body-parser');
const HTML         = FS.readFileSync(HTML_FILE)
.toString()
.replace(
  "{{JS_FILES}}",
  JS_FILES.map(function (file) {
    return "<script type=\"text/javascript\" src=\"" + file + "\"></script>";
  }).join("\n    ")
);

function json(resp, o) {
  resp.set('Content-Type', 'application/json');
  resp.set('Access-Control-Allow-Origin', '*');
  resp.send( JSON.stringify(o) );
}

//Create a server
app.use(logger);
app.use(serve_static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/specs', function specs_html(req,resp) {
  resp.set('Content-Type', 'text/html');
  resp.send(HTML);
});

app.post('/', function (req, resp) {
  json(resp, {when: 'for now'});
});

app.get('/_csrf', function (req, resp) {
  json(resp, {_csrf: 'some_value'});
});

app.post('/html', function (req, resp) {
  resp.set('Content-Type', 'text/html');
  resp.send( "<html><body>Some html.</body></html>" );
});

app.post('/404-html', function (req, resp) {
  resp
  .set('Content-Type', 'text/html')
  .status( 404 )
  .send( "<p>Not found: " + req.originalUrl + "</p>" )
  .end();
});

app.post("/string-as-html", function (req, resp) {
  resp.set('Content-Type', 'text/html');
  resp.send("Some invalid html.");
});

app.post("/text", function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send("Some plain text.");
});

app.post("/all-specs-pass", function (req, resp) {
  FS.writeFileSync("tmp/browser.js.results", JSON.stringify(req.body));
  json(resp, {ok: true});
});

app.post("/repeat", function (req, resp) {
  json(resp, {ok: true, data: req.body, about: 'data received: ' + JSON.stringify(req.body) });
});

app.post("/json", function (req, resp) {
  json(resp, {msg: 'get smart'});
});

app.post("/client-error-to-stdout", function (req, resp) {
  FS.writeFileSync("tmp/catch.browser.js.txt", req.body.message + "\n" + req.body.stack);
  json(resp, {ok: true});
});

app.use(function (req, resp) {
  resp
  .status(404)
  .send({msg: 'not found: ' + req.method + ' ' + req.originalUrl})
  .end();
});

app.listen(port, function() {
  console.warn("Server listening on: http://localhost:%s", port);
});



