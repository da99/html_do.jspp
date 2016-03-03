
# === {{CMD}}
test () {

  $0 duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }

  if [[ -n "$@" ]]; then
    js_setup jshint $@

    $0 test
    return 0
  fi # === Finish testing single file.

  $0 build
  return 0

}  # === end function
