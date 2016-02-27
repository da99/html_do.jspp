
spec(is_something, [null],      false);
spec(is_something, [undefined], false);
spec(is_something, [[]],       true);
spec(is_something, [{}],       true);
spec(is_something, [{a: "c"}], true);
function is_something(v) {
  var t = typeof v;
  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));
  return t !== 'null' && t !== 'undefined';
}
