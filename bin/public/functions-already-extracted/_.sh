
# === {{CMD}}  "lib/file.js"
# === Exits 0 if there are any functions already extracted.
functions-already-extracted () {
  file="$1"; shift
  dir="$(dirname "$file")/$(basename "$file" .js)"
  found=""
  while read NAME; do
    file_name="$dir/${NAME}.js"
    if [[ -s "$file_name" ]]; then
      echo "$file_name"
      found="yes"
    fi
  done < <(js_setup function-names-in-file "$file")

  if [[ -n "$found" ]]; then
    exit 0
  else
    exit 1
  fi
} # === end function
