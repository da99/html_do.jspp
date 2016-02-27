

function map_x(coll, f) {
  should_be(coll, is_enumerable);
  should_be(f, is_function);
  return _.map(coll, function (x) { return f(x); });
}
