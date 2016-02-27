

function each_x(coll, f) {
  should_be(coll, is_enumerable);
  should_be(f, is_function);
  return eachs(coll, function (_i, x) {
    return f(x);
  });
}
