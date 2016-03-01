/* jshint node: true, strict: true, undef: true */
/* globals Computer, is_empty */


// === Examples:
// App()
// App(..args for underlying Computer)
exports.App = App;
function App() {
  "use strict";

  if (!App._computer) {
    App._computer = new Computer();
  }

  if (!is_empty(arguments))
    App._computer.apply(null, arguments);

  return App;
}
