
source "$THIS_DIR/bin/lib/html.sh"

# === {{CMD}}
# ==  {{CMD}}  spec/dir
test-html () {
  local +x IFS=$'\n'

  if [[ -s "$TEMP/last_failed" ]]; then
    local +x last_failed="$(cat "$TEMP/last_failed")"
  else
    local +x last_failed=""
  fi

  if [[ -z "$@" ]]; then # ==================================================

    js_setup jshint lib/html/html.js

    for DIR in $(find lib/html/specs/ -maxdepth 1 -mindepth 1 -type d); do

      if [[ -n "$last_failed" && "$last_failed" != "$DIR" ]]; then
        continue
      fi

      test-html "$DIR" || {
        stat="$?"
        echo "$DIR" > "$TEMP/last_failed"
        exit $stat
      }

      if [[ -n "$last_failed" ]]; then
        rm -f "$TEMP/last_failed"
        break
      fi

    done # === for

    if [[ -z "$last_failed" ]]; then
      mksh_setup GREEN "=== All pass."
    else
      echo "=== Starting over all other tests: "
      test-html
    fi

    return 0
  fi # ======================================================================

  local +x DIR="$1"; shift
  local +x ACTUAL="$TEMP/actual"
  local +x STAT=0
  local +x OUTPUT=""

  rm -rf "$ACTUAL"; mkdir -p "$ACTUAL" # === Re-set sandbox:

  mksh_setup BOLD "=== Testing: {{$DIR}}"
  for FILE in "$DIR/input"/*.html; do
    [[ "$(basename "$FILE")" == _.* ]] && continue || :
    { [[ ! -f "$FILE" ]] && echo "=== No html files." && exit 1; } || :

    STAT=0
    OUTPUT="$ACTUAL/error.msg"

    html --template "$FILE" --output-dir "$ACTUAL" --public-dir "$TEMP" >"$OUTPUT" 2>&1 || { STAT=$?; }
    if [[ "$STAT" -ne 0 && -f "$DIR/expect/error.msg" ]]; then
      find "$ACTUAL" -type f -not -name "error.msg" -print | xargs -I FILE rm FILE
    fi
    if [[ "$STAT" -ne 0 && ! -f "$DIR/expect/error.msg" ]]; then
      mksh_setup RED "=== html command failed with: {{$STAT}} $(cat "$OUTPUT")"
      exit $STAT
    fi
    if [[ "$STAT" -eq 0 && ! -s "$OUTPUT" ]]; then
      rm "$OUTPUT"
    fi
  done

  if ! mksh_setup dirs-are-equal ignore-whitespace "$ACTUAL" "$DIR/expect"; then
    mksh_setup RED "=== {{Failed}}: spec failed "
    test -f "$OUTPUT" && cat "$OUTPUT"
    exit 1
  else
    tput cuu1; tput el
    mksh_setup GREEN "=== {{$DIR}}"
  fi

  # echo -e "=== split: $Green$FILE$Reset"

} # end function test-html


