
# === {{CMD}}
test () {

  $0 duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }

  if [[ -n "$@" && "$1" == *.js ]]; then
    js_setup jshint $@

    $0 test
    return 0
  fi # === Finish testing single file.

  $0 test-node-js
  $0 test-browser-js
  $0 test-html
}  # === end function
