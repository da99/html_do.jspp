
source "$THIS_DIR/bin/lib/find-build-files.sh"
source "$THIS_DIR/bin/lib/server.sh"

# === {{CMD}}
build-browserjs () {

  duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }
  local +x OUTPUT="build/browser.js"
  local +x browser_results="tmp/browser.js.results"
  local +x names="spec base state dom data-do"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".map
  rm -f "$browser_results"

  temp="$TEMP/spec"

  # === BROWSER: ==============================================================

  test-browser-js
  mksh_setup BOLD "=== Building: {{$OUTPUT}}"

  paste --delimiter=\\n --serial                \
    bower_components/jquery/dist/jquery.min.js   \
    bower_components/lodash/dist/lodash.min.js    \
    bower_components/mustache.js/mustache.min.js   \
    bower_components/form-to-obj/form-to-obj.min.js \
    bower_components/alite/alite.min.js              \
    $(find-build-files top    $names)   \
    $(find-build-files body   $names)    \
    $(find-build-files bottom $names)     \
    > "$OUTPUT"

  jshint browserjs_specs/*.js || { stat=$?; mksh_setup RED "{{Failed}} jshint"; exit $stat; }

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

  mksh_setup GREEN "=== Done building: {{$OUTPUT}} $(($(stat --printf="%s" "$OUTPUT") / 1024)) Kb"

} # === end function


