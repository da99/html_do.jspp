/* jshint strict: true, undef: true */
/* globals spec, _, is_arguments, is_plain_object, is_function */
/* globals exports, log */



spec(to_string, [null], 'null');
spec(to_string, [undefined], 'undefined');
spec(to_string, [[1]], '[1]');
spec(to_string, ['yo yo'], '"yo yo"');
spec(to_string, [{a:'b', c:'d'}], '{"a":"b","c":"d"}');

exports.to_string = to_string;
function to_string(val) {
  "use strict";

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

  if (_.isFunction(val))
    return (val.name) ? val.name + ' (function)' : val.toString();

  if (_.isString(val))
    return '"' + val + '"';

  if (_.isArray(val))
    return '[' + _.map(_.toArray(val), to_string).join(', ') + '] (Array)';

  if (val.constructor === arguments.constructor)
    return '[' + _.map(_.toArray(val), to_string).join(', ') + '] (arguments)';

  return val.toString();

} // === func

