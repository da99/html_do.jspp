/* jshint browser: true, strict: true, undef: true */
/* globals spec, alite, log */



try {

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

} catch (e) {

  alite(
    {
      url: "/client-error-to-stdout",
      method: "POST",
      data: {
        stack: e.stack,
        message: e.message
      }
    }
  );

  throw e;
}
