
spec(is_empty, [[]], true);
spec(is_empty, [{}], true);
spec(is_empty, [""], true);
spec(is_empty, [{a: "c"}], false);
spec(is_empty, [[1]],      false);
spec(is_empty, ["a"],      false);
spec(is_empty, [return_arguments()],      true);
spec(is_empty, [return_arguments(1,2,3)], false);
spec_throws(is_empty, [null],   'invalid value for is_empty: null');
function is_empty(v) {
  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));

  var v_type = typeof v;
  if ( v_type === 'null' || v_type === 'undefined')
    throw new Error("null and undefined not allowed.");

  if (_.isPlainObject(v))
    return _.keys(v).length === 0;

  var l = v.length;
  if (!_.isFinite(l))
    throw new Error("!!! Invalid .length property.");

  return l === 0;
} // === func



