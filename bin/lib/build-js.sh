
# === {{CMD}} path/to/file        dir1  dir2  dir3 ...
# === {{CMD}} path/to/file  CMD   dir1  dir2  dir3 ...
# === Produces:  path/to/file.js   path/to/file.specs.js
# === Does not initialize files (delete, re-create), so you
# ===   can add to the top of the file before build-js writes to it.
# === The optional CMD receives 4 values:
# ===   "FILE"  "PREVIOUS FILE"  "OUTPUT-FILE.js"  "OUTPUT-FILE.specs.js"
# ===
build-js () {
  local +x OUTPUT="$1"; shift
  local +x CMD=""
  if [[ ! -d "$1" ]]; then
    CMD="$1"; shift
  fi

  local +x DIRS="$@"
  local +x ALL="$(find "$DIRS" -type f -name "*.js")"
  local +x TOP=$(echo "$ALL" | grep "_.top.js")
  local +x MIDDLE=$(echo "$ALL" | grep -v "_.\(top\|bottom\).js" | sort)
  local +x BOTTOM=$(echo "$ALL" | grep "_.bottom.js" | tac)


  append_to_both () {
    tee -a "$OUTPUT".js "$OUTPUT".specs.js >/dev/null
  }

  paste --delimiter=\\n --serial "$TOP"    | append_to_both

  local +x IFS=$'\n'
  local +x PREV_FILE=""

  for FILE in $MIDDLE ; do
    local +x NAME="$(basename $FILE .js)"
    local +x DIR="$(dirname "$FILE")"
    local +x MAIN="$(echo "$FILE" | cut -d'/' -f2 )"
    local +x CATEGORY="$(echo "$FILE" | cut -d'/' -f3 )"
    local +x CAT="${DIR//"/"/"."}"
    CAT="${CAT//"-"/"_"}"

    THIS_CAT=${THIS_CAT//"-"/"_"}

    grep -Pzo '(?s)function\ +'${NAME//'$'/'\$'}'\(.+'  "$FILE"  >> "$OUTPUT".js || {
      mksh_setup RED "!!! Function BOLD{{$NAME}} RED{{not}} found in: BOLD{{$FILE}}"
      exit 1
    }
    cat "$FILE"                                                  >> "$OUTPUT".specs.js

    if [[ ! -z "$CMD" ]]; then
      $CMD "$FILE" "$PREV_FILE" "$OUTPUT".js "$OUTPUT".specs.js
    fi
    PREV_FILE="$FILE"
  done # === for

  paste --delimiter=\\n --serial "$BOTTOM" | append_to_both

  mksh_setup GREEN "=== wrote $OUTPUT.js"
  mksh_setup GREEN "=== wrote $OUTPUT.specs.js"
} # === end function

specs () {
  local +x TEMP=/tmp/dum_dum_boom_boom/build-js
  mkdir -p "$TEMP"
  cd "$THIS_DIR/bin/lib/build-js"

  rm -rf "$TEMP/actual"; mkdir "$TEMP/actual"

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


  dum_dum_boom_boom build-js "$TEMP/actual/basic" "basic/input"
  should-match-dirs  "$TEMP/actual/"  "basic/expect"
} # === specs
