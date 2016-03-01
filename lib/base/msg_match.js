/* jshint strict: true, undef: true */
/* globals spec, is_string, _, is_plain_object, is_empty, is_function, be, is_boolean */


spec(msg_match, [1,1], true);
spec(msg_match, ["a", "a"], true);
spec(msg_match, [[1],[1]], true);
spec(msg_match, [[1,[2]],[1,[2]]], true);
spec(msg_match, [{a:"b"}, {a:"b",c:"d"}], true);
spec(msg_match, [{a:is_string}, {a:"b"}], true);
spec(msg_match, [{}, {a:"b"}], false);
spec(msg_match, [{}, {}], true);
spec(msg_match, [[], []], true);

exports.msg_match = msg_match;
function msg_match(pattern, msg) {
  "use strict";

  if (_.isEqual(pattern, msg))
    return true;

  if (is_plain_object(pattern) && is_plain_object(msg)) {
    if (is_empty(pattern) !== is_empty(msg))
      return false;

    return !_.detect(_.keys(pattern), function (key) {
      var target = pattern[key];
      if (msg[key] === target)
        return !true;
      if (is_function(target))
        return !be(is_boolean, target(msg[key]));
      return !false;
    });
  }

  return false;
}
