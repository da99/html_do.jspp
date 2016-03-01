/* jshint strict: true, undef: true */
/* globals spec_returns, _, to_string, is_enumerable, length, keys_or_indexes */
/* globals exports */


// TODO: spec :eachs does not alter inputs
spec_returns(
  ["01", "12"],
  function eachs_passes_key_and_val() {
    "use strict";

    var v = [];
    eachs( [1,2], function (kx, x) { v.push("" + kx + x); });
    return v;
  }
);

spec_returns(
  ["1a", "1b", "2a", "2b"],
  function eachs_passes_vals_of_multiple_colls() {
    "use strict";

    var v = [];
    eachs( [1,2], ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);

spec_returns(
  ["onea", "twoa"],
  function eachs_passes_keys_and_vals_of_arrays_and_plain_objects() {
    "use strict";

    var v = [];
    eachs({one: 1, two: 2}, ["a"], function (kx, x, ky, y) { v.push("" + kx + y); });
    return v;
  }
);

spec_returns(
  ["1a", "1b", "2a", "2b"],
  function eachs_passes_vals_of_plain_object_and_array() {
    "use strict";

    var v = [];
    eachs({one: 1, two: 2}, ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);

spec_returns( [],
  function eachs_returns_empty_array_if_one_array_is_empty() {
    "use strict";

    var v = [];
    eachs({one: 1, two: 2}, [], ["a"], function (kx, x, ky, y, kz, z) {
      v.push("" + kx + y);
    });
    return v;
  }
);

exports.eachs = eachs;
function eachs() {
  "use strict";

  var args = _.toArray(arguments);

  if (args.length < 2)
    throw new Error("Not enough args: " + to_string(args));
  var f    = args.pop();

  // === Validate inputs before continuing:
  for (var i = 0; i < args.length; i++) {
    if (!is_enumerable(args[i]))
        throw new Error("Invalid value for eachs: " + to_string(args[i]));
  }

  // === Process inputs:
  var cols_length = length(args);

  return eachs_row_maker([], 0, _.map(args, keys_or_indexes));

  function eachs_row_maker(row, col_i, key_cols) {
    if (col_i >= cols_length) {
      if (row.length !== f.length)
        throw new Error("f.length (" + f.length + ") should be " + row.length + " (collection count * 2 )");
      f.apply(null, [].concat(row)); // set reduced value
      return;
    }

    var keys = key_cols[col_i].slice(0);
    var vals = args[col_i];
    ++col_i;

    for(var i = 0; i < keys.length; i++) {
      row.push(keys[i]); // key
      row.push(vals[keys[i]]); // actual value

      eachs_row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return;
  }
}
