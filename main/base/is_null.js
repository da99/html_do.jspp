

spec(is_null, [null], true);
spec(is_null, [undefined], false);
function is_null(v) {
  return v === null;
}
