/* jshint strict: true, undef: true */
/* globals spec, to_string, _, is_enumerable, is_undefined, length, keys_or_indexes */


// TODO: spec: does not modify arr
spec(reduce_eachs, [
  [], [1,2], function (v, kx, x) { "use strict"; v.push("" + kx + x); return v; }
], ["01", "12"]);

spec(reduce_eachs, [
  [], [1,2], ["a", "b"], function (v, kx, x, ky, y) { "use strict"; v.push("" + x + y); return v; }
], ["1a", "1b", "2a", "2b"]);

spec(reduce_eachs, [
  [], {one: 1, two: 2}, ["a"], function (v, kx, x, ky, y) { "use strict"; v.push("" + kx + y); return v; }
], ["onea", "twoa"]);

spec(reduce_eachs, [
  [], {one: 1, two: 2}, [], ["a"], function (v, kx, x, ky, y, kz, z) { "use strict"; v.push("" + kx + y); return v; }
], []);

exports.reduce_eachs = reduce_eachs;
function reduce_eachs() {
  "use strict";

  var args = _.toArray(arguments);
  if (args.length < 3)
    throw new Error("Not enough args: " + to_string(args));
  var init = args.shift();
  var f    = args.pop();

  // === Validate inputs before continuing:
  for (var i = 0; i < args.length; i++) {
    if (!is_enumerable(args[i]))
        throw new Error("Invalid value for reduce_eachs: " + to_string(args[i]));
  }

  if (is_undefined(init))
    throw new Error("Invalid value for init: " + to_string(init));


  // === Process inputs:
  var cols_length = length(args);

  return reduce_eachs_row_maker([init], 0, _.map(args, keys_or_indexes));

  function reduce_eachs_row_maker(row, col_i, key_cols) {
    if (col_i >= cols_length) {
      if (row.length !== f.length)
        throw new Error("f.length (" + f.length + ") should be " + row.length + " (collection count * 2 + 1 (init))");
      row[0] = f.apply(null, [].concat(row)); // set reduced value
      return row[0];
    }

    var keys = key_cols[col_i].slice(0);
    var vals = args[col_i];
    ++col_i;

    for(var i = 0; i < keys.length; i++) {
      row.push(keys[i]); // key
      row.push(vals[keys[i]]); // actual value

      reduce_eachs_row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return row[0];
  }
} // === function: reduce_eachs
