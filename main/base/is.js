
spec_returns(true,  function () { return is(5)(5); });
spec_returns(false, function () { return is("a")("b"); });
function is(target) {
  return function (val) { return val === target; };
}
