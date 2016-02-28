/* jshint esnext: true, strict: true, undef: true */
/* globals FS */

function is_file(v) {
  "use strict";
  try {
    return FS.lstatSync(v).isFile();
  } catch (e) {
    return false;
  }
}
