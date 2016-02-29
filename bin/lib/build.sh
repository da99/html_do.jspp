
build () {
    # ===   __  build
    ugly () {
      # === __  build-node
      local name="$1"; shift
      local output="build/${name}"
      local file="$output.js"
      rm -f "$file"
      rm -f "$file".map
      names="$@"
      uglifyjs                           \
        -b --comments all                 \
        --screw-ie8                        \
        $($0 top-build-files    $names)     \
        $($0 body-build-files   $names)      \
        $($0 bottom-build-files $names)       \
        --source-map "$file".map > "$file"

      dups="$($0 print-dups "$file" || :)"
      if [[ ! -z "$dups" ]]; then
        echo -e "!!! ${Red}Dups found${Color_Off}:\n$dups" 1>&2
        exit 1
      fi

      js_setup jshint "$file"
    }

    ugly "browser"  spec base state dom   data-do
    ugly "node"     spec base state node
    node "build/node.js" test
    echo "=== ${Bold}Test for browser.js not ready yet${Color_Off}"
} # === end function
