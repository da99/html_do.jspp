
test-node-js () {
  local FILE="build/node.js"
  rm -rf "$FILE"
  rm -rf "$FILE".map

  local temp="$TEMP/spec"

  # === NODE: =================================================================
  echo -e "=== Testing: ${Bold}node.js${Color_Off}"
  local names="spec base state node"
  cat                               \
    $($0 top-build-files $names)     \
    $($0 body-build-files $names)     \
    $($0 bottom-build-files $names) > build/node.js

  node nodejs_specs/spec.js test 2>&1 | js_setup map-errors-to-files

  echo -e "=== Done testing: ${Green}node.js${Color_Off}"
} # === end function test-node-js
