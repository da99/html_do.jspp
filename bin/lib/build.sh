
# === {{CMD}}
build () {

  ugly () {
    local name="$1"; shift
    local output="build/${name}"
    local file="$output.js"

    rm -f "$file"
    rm -f "$file".map
    names="$@"
    files="$($0 top-build-files $names) $($0 body-build-files $names) $($0 bottom-build-files $names)"
    jshint $files
    uglifyjs                           \
      -b --comments all                 \
      --screw-ie8                        \
      --source-map "$file".map            \
      $files > "$file"

    dups="$($0 print-dups "$file" || :)"
    if [[ ! -z "$dups" ]]; then
      echo -e "!!! ${Red}Dups found${Color_Off}:\n$dups" 1>&2
      exit 1
    fi

    js_setup jshint "$file"
  }

  # === NODE: =================================================================
  echo -e "=== Building: ${Bold}node.js${Color_Off}"
  ugly "node" spec base state node
  node "lib/node.spec.js" test
  echo -e "=== Done building: ${Green}node.js${Color_Off}"

  # === BROWSER: ==============================================================
  ugly "browser"  spec base state dom   data-do
  echo -e "=== Test for ${Orange}browser.js${Color_Off} not ready yet"

} # === end function
