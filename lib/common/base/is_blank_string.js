/* jshint strict: true, undef: true */
/* globals spec, be, is_string, length, _ */
/* globals exports */

spec(is_blank_string, [""],     true);
spec(is_blank_string, ["   "],  true);
spec(is_blank_string, [" a  "], false);

exports.is_blank_string = is_blank_string;
function is_blank_string(v) {

  be(is_string, v);
  return length(_.trim(v)) < 1;
}
