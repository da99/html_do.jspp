/* jshint strict: true, undef: true */
/* globals to_string, length, setTimeout, be, is_specs */


exports.spec_next = spec_next;
function spec_next(specs) {
  "use strict";

  be(is_specs, specs);

  if (specs.i === 'init') {
      specs.i = 0;
  } else {
    if (specs.dones[specs.i] !== true)
      throw new Error("Spec did not finish: " + to_string(specs.list[specs.i]));
    specs.i = specs.i + 1;
  }

  var i    = specs.i;
  var list = specs.list;
  var func = list[i];

  // === Are all specs finished?
  if (!func && i >= length(specs.list)) {
    specs.total = i;
    if (specs.total !== specs.list.length)
      throw new Error('Not all specs finished: ' + to_string(specs.total) + ' !== ' + to_string(specs.list.length));
    specs.on_finish(specs);
    return length(specs.list);
  }

  // === Function was found?
  if (!func) {
    throw new Error('Spec not found: ' + to_string(i));
  }

  // === Async?
  if (length(func) === 1 ) {
    setTimeout(function () {
      if (!specs.dones[i])
        throw new Error("Spec did not finish in time: " + to_string(func));
    }, 2500);
    func(function () {
      specs.dones[i] = true;
      spec_next(specs);
    });
    return false;
  }

  // === Regular spec, non-asyc?
  if (length(func) === 0) {
    func();
    specs.dones[i] = true;
    return spec_next(specs);
  }

  throw new Error('Function has invalid arguments: ' + to_string(func));
}
