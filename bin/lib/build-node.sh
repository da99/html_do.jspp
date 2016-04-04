
source "$THIS_DIR/bin/lib/find-build-files.sh"

# === {{CMD}}
build-node () {

  local +x IFS=$'\n'
  local +x err_found=""
  local +x OUTPUT="lib/node/build/node.js"
  local +x names="$(ls -d lib/common/*/) lib/node/node"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".*

  mksh_setup BOLD "=== Building: {{$OUTPUT}}"

  cat \
    $(find-build-files top    $names) \
    $(find-build-files body   $names) \
    $(find-build-files bottom $names) \
    > "$OUTPUT"

  mksh_setup BOLD "=== Testing: {{node.js}}"
  node lib/node/spec.js test 2>&1  | js_setup map-errors-to-files || {
    stat=$?; echo -e "=== ${Red}Failed${Color_Off}" 1>&2; exit $stat;
  }
  mksh_setup GREEN "=== Done building and testing: {{$OUTPUT}}"
} # === end function
