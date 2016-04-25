
# === {{CMD}} dum-dum.file.html  my/output/dir/  public/dir/
# === {{CMD}} input/dir          my/output/dir/  public/dir
build-html () {
  node $THIS_DIR/lib/html/build-html.js "$@" | xargs -I NEW_FILE mksh_setup GREEN "=== {{wrote}}: NEW_FILE"

  # vnu="$(echo tmp/validator/*/dist/vnu.jar)"
  # final="$(node $THIS_DIR/lib/html/html.js $THE_ARGS)"
  # # === If <body is found, validate whole document:
  # if echo "$final" | grep -i '<body' &>/dev/null; then
  #   echo "$final" | java -jar "$vnu" - || { stat="$?"; echo $action 1>&2; exit $stat; }
  # fi
  # echo "$final"
} # === end function


specs () {
  local +x TEMP="/tmp/dum_dum_boom_boom"

  if [[ -z "$@" && -s "$TEMP/last_failed" ]]; then # ========================
    specs "$(cat "$TEMP/last_failed")" || exit 1
    rm -f "$TEMP/last_failed"
    specs || exit 1
    return 0
  fi # ======================================================================

  if [[ ! -z "$@" ]]; then # ================================================
    for DIR in $@; do
      if [[ ! -d "$DIR" ]]; then
        local +x DIR="lib/html/specs/$DIR"
      fi

      if [[ ! -d "$DIR" ]]; then
        mksh_setup RED "!!! Directory {{not found}}: $DIR"
        exit 1
      fi

      test-html "$DIR" || exit 1
    done
    return 0
  fi # ======================================================================

  js_setup jshint lib/html/html.js

  for DIR in $(find lib/html/specs/ -maxdepth 1 -mindepth 1 -type d); do
    test-html "$DIR" || exit 1
  done # === for

  mksh_setup GREEN "=== All {{pass}}."
} # === specs ()


# e.g.: test-html   path/to/spec/dir
test-html () {
  local +x IFS=$'\n'
  local +x TEMP="/tmp/dum_dum_boom_boom"
  local +x DIR="$1"; shift
  local +x TARGET_DIR="$DIR"
  local +x ACTUAL="$TEMP/actual"
  local +x STAT=0
  local +x OUTPUT="$ACTUAL/output"
  local +x ERROR_MSG="$ACTUAL/error.msg"
  local +x DIFF_OUTPUT="$(mktemp)"

  rm -rf "$ACTUAL"; mkdir -p "$ACTUAL" # === Re-set sandbox:

  mksh_setup BOLD "=== Testing: {{$DIR}}"

  STAT=0

  dum_dum_boom_boom build-html "$DIR/input" "$ACTUAL" "$TEMP" >"$OUTPUT" 2>"$ERROR_MSG" || { STAT=$?; }

  echo "$DIR" > "$TEMP/last_failed"

  if [[ "$STAT" -eq 0 ]]; then
    if grep -v wrote "$OUTPUT"; then
      mksh_setup RED "!!! {{Unexpected}} output:"
      cat $OUTPUT >&2
      exit 1
    else
      rm "$OUTPUT"
    fi
  fi

  if [[ "$STAT" -ne 0 && ! -f "$DIR/expect/error.msg" ]]; then
    mksh_setup RED "!!! html command failed with: {{$STAT}} $(cat "$ERROR_MSG")"
    exit $STAT
  fi

  if [[ "$STAT" -eq 0 && ! -s "$ERROR_MSG" ]]; then
    rm "$ERROR_MSG"
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
  mksh_setup GREEN "=== {{Passed}}: $DIR"

} # end function test-html


