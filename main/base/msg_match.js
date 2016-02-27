

spec(msg_match, [1,1], true);
spec(msg_match, ["a", "a"], true);
spec(msg_match, [[1],[1]], true);
spec(msg_match, [[1,[2]],[1,[2]]], true);
spec(msg_match, [{a:"b"}, {a:"b",c:"d"}], true);
spec(msg_match, [{a:is_string}, {a:"b"}], true);
spec(msg_match, [{}, {a:"b"}], false);
spec(msg_match, [{}, {}], true);
spec(msg_match, [[], []], true);
function msg_match(pattern, msg) {
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
        return !should_be(target(msg[key]), is_bool);
      return !false;
    });
  }

  return false;
}
