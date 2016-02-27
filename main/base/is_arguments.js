

spec(is_arguments, [return_arguments()], true);
spec(is_arguments, [[]], false);
function is_arguments(v) {
  return is_something(v) && or(is(0), is_positive)(v.length) && v.hasOwnProperty('callee');
}


