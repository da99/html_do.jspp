/* jshint strict: true, undef: true */
/* globals spec, identity, to_string, is_function, _, apply_function */
/* globals exports */


exports.to_slot = to_slot;

function to_slot(func, _args) {
  "use strict";

  const ARGS = to_array(arguments).slice(1);

  return function _to_slot_() {

    const MIDDLE_ARGS = to_array(arguments);
    const FIN_ARGS = reduce_eachs([], ARGS, function (array, _i, x) {
      if (x !== '{{_}}') {
        array.push(x);
        return array;
      }

      if (is_empty(MIDDLE_ARGS))
        throw new Error("Not enough arguments for: " + to_string(func) + " args: " + length(MIDDLE_ARGS) + " != " + length(ARGS));

      array.push(MIDDLE_ARGS.shift());

      return array;
    });

    if (!is_empty(MIDDLE_ARGS))
      throw new Error("Extra args for : " + to_string(func) + " extra: " + length(MIDDLE_ARGS));

    return func.apply(null, FIN_ARGS);
  }; // === return

} // === function to_slot
