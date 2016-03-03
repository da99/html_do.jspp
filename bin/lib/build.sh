
# === {{CMD}}
build () {

  rm -rf build/*.js
  rm -rf build/*.js.map

  temp="$TEMP/spec"
  ugly () {
    local name="$1"; shift
    local output="build/${name}"
    local file="$output.js"

    names="$@"
    files="$($0 top-build-files $names) $($0 body-build-files $names) $($0 bottom-build-files $names)"
    uglifyjs                           \
      -b --comments all                 \
      --screw-ie8                        \
      --source-map "$file".map            \
      $files > "$file"

    { jshint "$file" &>/dev/null; } || { jshint $files; }

    dups="$($0 print-dups "$file" || :)"
    if [[ ! -z "$dups" ]]; then
      echo -e "!!! ${Red}Dups found${Color_Off}:\n$dups" 1>&2
      exit 1
    fi

    js_setup jshint "$file"
  }

  # === NODE: =================================================================
  echo -e "=== Building: ${Bold}node.js${Color_Off}"
  local names="spec base state node"
  cat $($0 top-build-files $names) $($0 body-build-files $names) $($0 bottom-build-files $names) > build/node.js
  err_found=""


  while IFS= read LINE; do
    if [[ "$LINE" == *"   at "* ]]; then
      new_line="$(echo $LINE | tr -s ' ')"
      func_name="$(echo $new_line | cut -d' ' -f 2)"
      file="$(echo $new_line | cut -d' ' -f 3 | cut -d'(' -f2 | cut -d':' -f1)"
      num="$(echo $new_line | cut -d' ' -f 3 | cut -d'(' -f2 | cut -d':' -f2)"
      line="$([[ -f "$file" ]] && sed -n -e ${num}p "$file" || :)"
      if [[ -n "$line" ]]; then

        while IFS= read RESULT; do
          echo -e -n "  ${Green}$func_name${Color_Off} -> "
          echo -e "${BGreen}$(echo $RESULT | cut -d':' -f1)${Color_Off} ${BRed}@${Color_Off} ${Bold}$(echo $RESULT | cut -d':' -f2)${Color_Off}"
          echo -e -n "    ${BOrange}"
          echo -e $(echo $RESULT | cut -d':' --complement  -f1-3)${Color_Off}
          echo "-----------------------------------------------------------------"
        done < <(ag --vimgrep --literal "$line" lib)

      else
        echo $LINE
      fi
      err_found="yes"
    else
      echo "$LINE"
    fi
  done < <(node lib/node.spec.js test 2>&1) # || { stat=$?; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; })

  [[ -n "$err_found" ]] && exit 1 || :
  # echo -e "=== Creating .map file..."
  # ugly "node" $names
  # node "lib/node.spec.js" test &>$temp || { stat=$?; cat "$temp"; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; }
  echo -e "=== Done building: ${Green}node.js${Color_Off}"

  # === BROWSER: ==============================================================
  echo -e "=== Building: ${Bold}browser.js${Color_Off}"
  names="spec base state dom data-do"
  # ugly "browser"  $names
  cat                             \
    $($0 top-build-files $names)   \
    $($0 body-build-files $names)   \
    $($0 bottom-build-files $names)  \
    > build/browser.js
  echo -n -e "=== Refreshing ${Orange}browser${Color_Off}... "
  { gui_setup reload-browser google-chrome "Dum" && echo -e "${Green}Done${Color_Off}"; } ||
    { echo -e "=== ${Red}Failed$Color_Off}"; }

} # === end function
