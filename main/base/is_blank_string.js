
spec(is_blank_string, [""],     true);
spec(is_blank_string, ["   "],  true);
spec(is_blank_string, [" a  "], false);
function is_blank_string(v) {
  be(is_string, v);
  return length(_.trim(v)) < 1;
}
