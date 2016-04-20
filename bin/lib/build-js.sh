
# === {{CMD}} path/to/file                dir1  dir2  dir3 ...
# === {{CMD}} path/to/file  template.js   dir1  dir2  dir3 ...
# === Produces:  path/to/file.js   path/to/file.specs.js
# === Does not initialize files (delete, re-create), so you
# ===   can add to the top of the file before build-js writes to it.
# === The template file is evaluated after each concat:
# ===
# ===    exports.{{NAME}}         = {{NAME}};
# ===    exports.{{CAT}}.{{NAME}} = {{NAME}};
# ===    var PATH = "{{PATH}}";
# ===
build-js () {
  local +x OUTPUT="$1"; shift
  local +x TEMPLATE=""
  if [[ -f "$1" ]]; then
    TEMPLATE="$(cat "$1")"; shift
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
  local +x LAST_CAT=""
  local +x LAST_MAIN=""

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

    if [[ ! -z "$TEMPLATE" ]]; then
      local +x CURRENT_TEMPLATE="$TEMPLATE"
      CURRENT_TEMPLATE="${CURRENT_TEMPLATE//"{{NAME}}"/"$NAME"}"
      CURRENT_TEMPLATE="${CURRENT_TEMPLATE//"{{CAT}}"/"$CAT"}"
      CURRENT_TEMPLATE="${CURRENT_TEMPLATE//"{{DIR}}"/"$DIR"}"
      CURRENT_TEMPLATE="${CURRENT_TEMPLATE//"{{PATH}}"/"$FILE"}"
      echo "$CURRENT_TEMPLATE" | append_to_both
    fi
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
