/* jshint browser: true, strict: true, undef: true */
/* globals spec, alite, log, Scope_Dum_Dum_Boom_Boom, Dum_Dum_Boom_Boom */

  function import_funcs(funcs) {
    "use strict";
    Dum_Dum_Boom_Boom.common.base.eachs(funcs, function (name, func) {
      window[name] = func;
    });
  }

try {

  import_funcs(Dum_Dum_Boom_Boom.browser.dom);
  import_funcs(Dum_Dum_Boom_Boom.browser.data_do);

  Dum_Dum_Boom_Boom.common.spec.spec(function (msg) {
    "use strict";
    alite({url: "/all-specs-pass", method: "POST", data: msg}).then(
      function (result) {
        var dt = new Date();
        Dum_Dum_Boom_Boom.common.spec.spec.default_msg(msg);
        Dum_Dum_Boom_Boom.common.base.log(dt.toLocaleString('en-US'));
      }
    ).catch(function (err) {
      Dum_Dum_Boom_Boom.common.base.log(err);
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
