/* jshint strict: true, undef: true */
/* globals is_array, is_arguments, to_string, function_to_name */

exports.apply_function = apply_function;
function apply_function(f, args) {
  "use strict";

  if (arguments.length !== 2)
    throw new Error('Wrong # of argumments: expected: ' + 2 + ' actual: ' + arguments.length);

  if (!is_array(args) && !is_arguments(args))
    throw new Error('Not an array/arguments: ' + to_string(args));

  if (f.length !== args.length)
    throw new Error('function.length (' + function_to_name(f) + ' ' + f.length + ') !== ' + args.length);

  return f.apply(null, args);
}
