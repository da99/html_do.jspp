
specs () {
  local +x TEMP=/tmp/dum_dum_boom_boom/build-js
  mkdir -p "$TEMP"
  cd "$THIS_DIR/bin/lib/build-js"

  reset-fs () {
    rm -rf "$TEMP/actual"; mkdir "$TEMP/actual"
  }

  should-match-dirs () {
    local +x ACTUAL="$1"; shift
    local +x EXPECT="$1"; shift
    local +x DIFF_OUTPUT="$TEMP/diff"
    if ! mksh_setup dirs-are-equal ignore-whitespace "$ACTUAL" "$EXPECT" >"$DIFF_OUTPUT" ; then
      mksh_setup RED "=== {{Failed}}: {{$ACTUAL}} != BOLD{{$EXPECT}}"
      cat "$DIFF_OUTPUT"
      exit 1
    fi
    mksh_setup GREEN "=== {{PASSED}}: $ACTUAL == $EXPECT"
  }


  for DIR in $(find . -maxdepth 1 -mindepth 1 -type d ); do
    local +x NAME="$(basename $DIR)"
    reset-fs
    if [[ -f "$NAME/run.sh" ]]; then
      source "$NAME/run.sh"
    else
      dum_dum_boom_boom build-js "$TEMP/actual/$NAME" "$NAME/input"
    fi
    should-match-dirs          "$TEMP/actual/"      "$NAME/expect"
  done

} # === specs

specs
