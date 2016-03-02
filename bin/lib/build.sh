
# === {{CMD}}
build () {

  temp="$TEMP/spec"
  ugly () {
    local name="$1"; shift
    local output="build/${name}"
    local file="$output.js"

    rm -f "$file"
    rm -f "$file".map
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
  node "lib/node.spec.js" test || { stat=$?; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; }

  echo -e "=== Creating .map file..."
  ugly "node" $names
  node "lib/node.spec.js" test &>$temp || { stat=$?; cat "$temp"; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat; }
  echo -e "=== Done building: ${Green}node.js${Color_Off}"

  # === BROWSER: ==============================================================
  ugly "browser"  spec base state dom   data-do
  echo -e "=== Test for ${Orange}browser.js${Color_Off} not ready yet"

} # === end function
