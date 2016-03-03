/* jshint browser: true, strict: true, undef: true */
/* globals spec, alite, log */



spec(function (msg) {
  "use strict";
  alite({url: "/all-specs-pass", method: "POST", data: msg}).then(
    function (result) {
      spec.default_msg(msg);
    }
  ).catch(function (err) {
    log(err);
  });
});
