
source "$THIS_DIR/bin/lib/find-build-files.sh"
# === {{CMD}} [dom|base|etc.]   "my text"
# === Used to prepend text to all files in a directory: dom, base, etc.
prepend-to () {
  local +x IFS=$'\n'
  local +x DIR="$1"; shift
  local +x text="$@"

  if [[ -z "$text" ]]; then
    echo '!!! Text is missing.' 1>&2
    exit 1
  fi

  local TMP_FILE="$(mktemp)"
  for FILE in $($0 find-build-files all $DIR); do
    echo "$text" > "$TMP_FILE"
    cat "$FILE" >> "$TMP_FILE"

    cat "$TMP_FILE" > "$FILE"
    echo "=== $FILE"
  done
  rm  "$TMP_FILE"
} # === end function
