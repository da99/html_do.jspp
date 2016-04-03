
source "$THIS_DIR/bin/lib/find-build-files.sh"

# === {{CMD}}
build-nodejs () {

  local +x IFS=$'\n'
  local +x temp="$TEMP/spec"
  local +x err_found=""
  local +x OUTPUT="build/node.js"
  local +x names="spec base state node"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".map

  mksh_setup "=== Building: {{$OUTPUT}}"

  cat \
    $(find-build-files top    $names) \
    $(find-build-files body   $names) \
    $(find-build-files bottom $names) \
    > "$OUTPUT"

  local +x TEST_RESULTS;
  TEST_RESULTS=$(node lib/node.spec.js test 2>&1 || { stat=$?; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; } )

  for LINE in $TEST_RESULTS; do
    if [[ "$LINE" != *"   at "* ]]; then
      echo "$LINE"
      continue
    fi

    err_found="yes"
    new_line="$(echo $LINE | tr -s ' ')"
    func_name="$(echo $new_line | cut -d' ' -f 2)"
    file="$(echo $new_line | cut -d' ' -f 3 | cut -d'(' -f2 | cut -d':' -f1)"
    num="$(echo $new_line | cut -d' ' -f 3 | cut -d'(' -f2 | cut -d':' -f2)"
    source_line="$([[ -f "$file" ]] && sed -n -e ${num}p "$file" || :)"

    if [[ -z "$source_line" ]]; then
      echo $LINE
      continue
    fi

    for RESULT in $(ag --vimgrep --literal "$source_line" lib); do
      echo -e -n "  ${Green}$func_name${Color_Off} -> "
      echo -e "${BGreen}$(echo $RESULT | cut -d':' -f1)${Color_Off} ${BRed}@${Color_Off} ${Bold}$(echo $RESULT | cut -d':' -f2)${Color_Off}"
      echo -e -n "    ${BOrange}"
      echo -e $(echo $RESULT | cut -d':' --complement  -f1-3)${Color_Off}
      echo "-----------------------------------------------------------------"
    done
  done # === for LINE in $TEST_RESULTS

  [[ -n "$err_found" ]] && exit 1 || :
  # echo -e "=== Creating .map file..."
  # ugly "node" $names
  # node "lib/node.spec.js" test &>$temp || { stat=$?; cat "$temp"; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; }
  echo -e "=== Done building: ${Green}$OUTPUT${Color_Off}"

} # === end function
