
function is_empty(v) {
  if (is_array(v))
    return v.length === 0;
  if (is_plain_object(v))
    return _.keys(v).length === 0;
  if (v.hasOwnProperty('length') && _.isFinite(v.length))
    return v.length === 0;

  throw new Error("Unknown .length for: " + to_string(v));
}


