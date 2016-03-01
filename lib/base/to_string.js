/* jshint strict: true, undef: true */
/* globals spec, _, is_arguments, is_plain_object, is_function */



spec(to_string, [null], 'null');
spec(to_string, [undefined], 'undefined');
spec(to_string, [[1]], '[1]');
spec(to_string, ['yo yo'], '"yo yo"');
spec(to_string, [{a:'b', c:'d'}], '{"a":"b","c":"d"}');

exports.to_string = to_string;
function to_string(val) {
  "use strict";

  var v = val;

  if (val === null)      return 'null';
  if (val === undefined) return 'undefined';
  if (val === false)     return 'false';
  if (val === true)      return 'true';

  if (_.isArray(val))
    return  '['+_.map(val, to_string).join(", ") + ']';

  if (_.isString(val))
    return '"' + val + '"';

  if ( is_arguments(val) )
    return to_string(_.toArray(val));

  if (is_plain_object(val)) {
    return '{' + _.reduce(_.keys(val), function (acc, k) {
      acc.push(to_string(k) + ':' + to_string(val[k]));
      return acc;
    }, []).join(",") + '}';
  }

  if (is_function(val) && val.hasOwnProperty('to_string_name'))
    return val.to_string_name;

  if (_.isFunction(v))
    return (v.name) ? v.name + ' (function)' : v.toString();

  if (_.isString(v))
    return '"' + v + '"';

  if (_.isArray(v))
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (Array)';

  if (v.constructor === arguments.constructor)
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (arguments)';

  return val.toString();
} // === func
