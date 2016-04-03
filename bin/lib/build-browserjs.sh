
source "$THIS_DIR/bin/lib/find-build-files.sh"
source "$THIS_DIR/bin/lib/server.sh"

# === {{CMD}}
build-browserjs () {

  local +x OUTPUT="build/browser.js"
  local +x browser_results="tmp/browser.js.results"
  local +x names="spec base state dom data-do"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".map
  rm -f "$browser_results"

  temp="$TEMP/spec"

  # === BROWSER: ==============================================================

  mksh_setup BOLD "=== Building: {{$OUTPUT}}"

  cat                                  \
    $(find-build-files top    $names)   \
    $(find-build-files body   $names)    \
    $(find-build-files bottom $names)     \
    > "$OUTPUT"

  jshint www/*.js || { stat=$?; mksh_setup RED "{{Failed}} jshint"; exit $stat; }

  if ! server is-running; then
    server start
  fi

  mksh_setup BOLD "=== Refreshing browser to re-run specs {{browser}}... "
  gui_setup reload-browser google-chrome "Dum" ||
    { stat=$?; mksh_setup RED "=== {{Failed}} opening: BOLD{{$(server index)}}"; exit $stat; }

  local count="0"
  while [[ ! -s "$browser_results" && $count -lt 100 ]]; do
    count=$((count + 1))
    sleep 0.1
  done

  if [[ -s "$browser_results" ]]; then
    mksh_setup GREEN "=== Browser specs: {{$(cat "$browser_results")}}"
  else
    mksh_setup RED "!!! Browser specs: {{Failed}}"
    exit 1
  fi

  mksh_setup GREEN "=== Done building: {{$OUTPUT}}"

} # === end function


