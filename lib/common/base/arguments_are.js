/* jshint strict: true, undef: true */
/* globals spec, is_arguments, to_arguments, is_num, _, to_string */
/* globals exports */

spec(
  arguments_are,
  [to_arguments(1), is_num, is_num],
  new Error('Wrong # of arguments: expected: 2 actual: 1')
);

exports.arguments_are = arguments_are;

function arguments_are(args_o, _funcs) {

  if (!is_arguments(args_o))
    throw new Error('not arguments: ' + to_string(args_o));

  var funcs = _.toArray(arguments);
  var args  = funcs.shift();

  if (args.length !== funcs.length) {
    throw new Error('Wrong # of arguments: expected: ' + funcs.length + ' actual: ' + args.length);
  }

  for (var i = 0; i < funcs.length; i++) {
    if (!funcs[i](args[i]))
      throw new Error('Invalid arguments: ' + to_string(args[i]) + ' !' + to_string(funcs[i]));
  }

  return _.toArray(args);
}
