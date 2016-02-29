
functions-not-extracted () {
  file="$1"; shift
  while read NAME; do
    if [[ ! -f "$(echo lib/*/${NAME}.js)" ]]; then
      echo "$NAME"
    fi
  done < <(js_setup function-names-in-file $file)
}  # === end function
