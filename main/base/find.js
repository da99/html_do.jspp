

function find(_funcs) {
  var funcs = _.toArray(arguments);
  return function (v) {
    return _.find(v, and.apply(null, funcs));
  };
}
