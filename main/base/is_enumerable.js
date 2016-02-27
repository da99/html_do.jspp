

spec(is_enumerable, [[]], true);
spec(is_enumerable, [{}], true);
spec(is_enumerable, [{}], true);
function is_enumerable(v) {
  return is_string(v) ||
  is_array(v)         ||
  is_plain_object(v)  ||
  _.isFinite(v.length) ||
    is_arguments(v);
}
