
function is_whitespace(v) {
  return is_string(v) && length(_.trim(v)) === 0;
}
