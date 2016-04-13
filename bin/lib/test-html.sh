
# === {{CMD}}
# ==  {{CMD}}  spec/dir
test-html () {
  local +x IFS=$'\n'

  if [[ -z "$@" && -s "$TEMP/last_failed" ]]; then
    $0 test-html "$(cat "$TEMP/last_failed")"
    rm -f "$TEMP/last_failed"
    $0 test-html
    return 0
  fi

  if [[ -z "$@" ]]; then # ==================================================

    js_setup jshint lib/html/html.js

    for DIR in $(find lib/html/specs/ -maxdepth 1 -mindepth 1 -type d); do
      test-html "$DIR"
    done # === for

    mksh_setup GREEN "=== All pass."

    return 0
  fi # ======================================================================

  local +x DIR="$1"; shift
  local +x ACTUAL="$TEMP/actual"
  local +x STAT=0
  local +x OUTPUT=""
  local +x DIFF_OUTPUT="$(mktemp)"

  rm -rf "$ACTUAL"; mkdir -p "$ACTUAL" # === Re-set sandbox:

  mksh_setup BOLD "=== Testing: {{$DIR}}"


  STAT=0
  OUTPUT="$ACTUAL/error.msg"

  $0 html --input-dir "$DIR/input" --output-dir "$ACTUAL" --public-dir "$TEMP" >"$OUTPUT" 2>&1 || { STAT=$?; }

  echo "$DIR" > "$TEMP/last_failed"

  if [[ "$STAT" -ne 0 && ! -f "$DIR/expect/error.msg" ]]; then
    mksh_setup RED "=== html command failed with: {{$STAT}} $(cat "$OUTPUT")"
    exit $STAT
  fi

  if [[ "$STAT" -eq 0 && ! -s "$OUTPUT" ]]; then
    rm "$OUTPUT"
  fi

  if [[ -f "$DIR/expect/error.msg" ]]; then
    # If error messages don't match, use EXPECT as a regexp match:
    if ! diff "$DIR/expect/error.msg"  "$ACTUAL/error.msg" >/dev/null 2>&1 ; then
      if ! grep -P "$(cat $DIR/expect/error.msg )" "$ACTUAL/error.msg" >/dev/null 2>&1; then
        mksh_setup RED "=== {{FAILED}}: BOLD{{error messages do not match}}:"
        mksh_setup RED "{{"$(cat "$ACTUAL/error.msg" || echo "[no error msg]")"}}"
        mksh_setup RED "   !=="
        mksh_setup RED "BOLD{{$(cat "$DIR/expect/error.msg")}}"
        exit 1
      fi
    fi
  else
    if ! mksh_setup dirs-are-equal ignore-whitespace "$ACTUAL" "$DIR/expect" >"$DIFF_OUTPUT" ; then
      mksh_setup RED "=== {{Failed}}: spec failed "
      cat "$DIFF_OUTPUT"
      rm "$DIFF_OUTPUT"
      test -f "$OUTPUT" && cat "$OUTPUT"
      exit 1
    fi
    rm -f "$DIFF_OUTPUT"
  fi

  rm -f "$TEMP/last_failed"
  tput cuu1; tput el
  mksh_setup GREEN "=== {{$DIR}}"

} # end function test-html


