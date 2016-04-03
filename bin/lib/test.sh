
source "$THIS_DIR/bin/lib/duplicate-functions.sh"
source "$THIS_DIR/bin/lib/test-node-js.sh"
source "$THIS_DIR/bin/lib/test-browser-js.sh"
source "$THIS_DIR/bin/lib/test-html.sh"



# === {{CMD}}
test () {

  duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }

  if [[ -n "$@" && "$1" == *.js ]]; then
    js_setup jshint $@

    test
    return 0
  fi # === Finish testing single file.

  test-node-js
  test-browser-js
  test-html
}  # === end function


