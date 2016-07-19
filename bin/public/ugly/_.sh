
# === {{CMD}}  browser|node|etc  specs base state etc.
# === Cleans up js files, combines them, creates source map.
# === This function is not being used currently because
# === Uglify is slow at creating source maps.
ugly () {
    local +x name="$1"; shift
    local +x output="build/${name}"
    local +x file="$output.js"

    local +x names="$@"
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
} # === end function
