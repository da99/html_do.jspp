
source "$THIS_DIR/bin/public/find-build-files/_.sh"

# === {{CMD}}
build-node () {

  local +x IFS=$'\n'
  local +x err_found=""
  local +x OUTPUT="lib/node/build/node.js"
  local +x names="$(ls -d lib/common/*/) lib/node/node"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".*

  sh_color BOLD "=== Building: {{$OUTPUT}}"

  cat \
    $(find-build-files top    $names) \
    $(find-build-files body   $names) \
    $(find-build-files bottom $names) \
    > "$OUTPUT"

  sh_color BOLD "=== Testing: {{node.js}}"
  node lib/node/spec.js test 2>&1 | js_setup map-errors-to-files $names
  # || {
  #   stat=$?; sh_color RED "=== {{Spec run failed}}"; exit $stat;
  # }
  sh_color GREEN "=== Done building and testing: {{$OUTPUT}}"
} # === end function
