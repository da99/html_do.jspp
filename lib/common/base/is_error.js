/* jshint strict: true, undef: true */
/* globals spec, to_string, is_something */
/* globals exports, is_plain_object, is_string */

spec(is_error, [new Error('anything')], true);
spec(is_error, ['anything'],            false);

exports.is_error = is_error;
spec(is_error, [new Error('meh')], true);
spec(is_error, [new TypeError('meow')], true);
spec(is_error, [{stack: "", message: ""}], false);
function is_error(v) {

  return is_something(v) &&
    (
      v.constructor === Error ||
     (!is_plain_object(v) && is_string(v.stack) && is_string(v.message))
    )
    ;
}
