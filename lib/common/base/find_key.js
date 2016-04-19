/* jshint strict: true, undef: true */
/* globals _, to_string */
/* globals exports */


exports.find_key = find_key;
function find_key(k, _args) {

  var args = _.toArray(arguments);
  args.shift();
  var o = _.detect(args, function (x) { return x.hasOwnProperty(k); });

  if (!o)
    throw new Error('Key, ' + to_string(k) + ', not found in any: ' + to_string(args));

  return o[k];
}
