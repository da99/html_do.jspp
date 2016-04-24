
# === {{CMD}} path/to/file            dir1  dir2  dir3 ...
# === {{CMD}} path/to/file  "STRING"  dir1  dir2  dir3 ...
# ===
# === Produces:  path/to/file.js   path/to/file.specs.js
# ===
# === Does not initialize files (delete, re-create), so you
# ===   can add to the top of the file before build-js writes to it.
# ===
# === The optional STRING is used in the comments between files:
# ===   /* STRING START: path/to/file.js */
# ===        ... content of file ...
# ===   /* STRING STOP: path/to/file.js */
# ===
build-js () {

  local +x OUTPUT="$1"; shift
  local +x COMMENT=""
  if [[ ! -d "$1" ]]; then
    COMMENT="$1"; shift
  fi

  # NOTE: Instead of using `find $DIRS`, we use `print ..$DIRS.. | xargs ... find DIR`
  # because `find` does not guarantee the order of files found based on the order of $DIRS.
  # Using `xargs in this case gives more control on order of files at the expense of efficiency.

  local +x DIRS="$@"
  local +x ALL="$(printf "%s\n" "$@" | xargs -I DIR find DIR -type f -name "*.js")"
  local +x TOP=$(echo "$ALL" | grep "_.top.js")
  local +x MIDDLE=$(echo "$ALL" | grep -v "_.\(top\|bottom\).js" | sort)
  local +x BOTTOM=$(echo "$ALL" | grep "_.bottom.js" | tac)

  append_to_both () {
    tee -a "$OUTPUT".js "$OUTPUT".specs.js >/dev/null
  }

  append_comment () {
    if [[ -z "$COMMENT" ]]; then
      return 0
    fi
    local +x POSITION="$1"; shift
    local +x FILE="$1"; shift
    echo "/* $COMMENT $POSITION: $FILE */" | append_to_both
  }

  for TOP_FILE in "$TOP"; do
    if [[ ! -f "$TOP_FILE" ]]; then
      continue
    fi
    append_comment "START" "$TOP_FILE"
    cat "$TOP_FILE" | append_to_both
    echo "\n" | append_to_both
    append_comment "STOP" "$TOP_FILE"
  done

  local +x IFS=$'\n'

  for FILE in $MIDDLE ; do
    if [[ ! -f "$FILE" ]]; then
      continue
    fi
    local +x NAME="$(basename $FILE .js)"

    append_comment "START" "$FILE"

    grep -Pzo '(?s)function\ +'${NAME//'$'/'\$'}'\(.+'  "$FILE"  >> "$OUTPUT".js || {
      mksh_setup RED "!!! Function BOLD{{$NAME}} RED{{not}} found in: BOLD{{$FILE}}"
      exit 1
    }

    cat "$FILE"  >> "$OUTPUT".specs.js
    echo "\n"    >> "$OUTPUT".specs.js

    append_comment "STOP" "$FILE"
  done # === for

  for BOTTOM_FILE in "$BOTTOM"; do
    if [[ ! -f "$BOTTOM_FILE" ]]; then
      continue
    fi
    append_comment "START" "$BOTTOM_FILE"
    cat "$BOTTOM_FILE" | append_to_both
    echo "\n" | append_to_both
    append_comment "STOP" "$BOTTOM_FILE"
  done

  mksh_setup GREEN "=== wrote $OUTPUT.js"
  mksh_setup GREEN "=== wrote $OUTPUT.specs.js"
} # === end function

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
