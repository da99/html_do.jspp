
# === {{CMD}}
test () {
  $0 duplicate_functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }
  files="$(find lib -type f -iname "*.js")"
  target=""
  if [[ -n "$@" ]]; then
    target="$1"; shift
    js_setup jshint "$target"
    if [[ "$target" == lib/* ]]; then
      name="$(echo "$target" | cut -d'/' -f1)"
      $0 build "$name"
    fi
    exit 0
  fi

  $0 build
}  # === end function
