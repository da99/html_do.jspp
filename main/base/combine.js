

function combine(_vals) {
  var vals = _.toArray(arguments);
  if (all(is_plain_object)(vals)) {
    return _.extend.apply(null, [{}].concat(vals));
  }
  if (all(is_array)(vals))
    return [].concat(vals);
  throw new Error("Only Array of Arrays or Plain Objects allowed: " + to_string(arguments));
}
