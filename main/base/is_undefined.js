

spec(is_undefined, [undefined], true);
spec(is_undefined, [null], false);
function is_undefined(v) {
  return v === undefined;
}
