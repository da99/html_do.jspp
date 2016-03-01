
# === {{CMD}}
test () {

  $0 duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }

  if [[ -z "$@" ]]; then
    $0 build
    exit 0
  fi

  files="$(find lib -type f -iname "*.js")"
  target=""
  target="$1"; shift

  js_setup jshint "$target"

  if [[ "$target" == lib/* ]]; then
    name="$(echo "$target" | cut -d'/' -f1)"
    $0 build "$name"
  fi

}  # === end function
