
source "$THIS_DIR/bin/lib/find-build-files.sh"
source "$THIS_DIR/bin/lib/server.sh"

# === {{CMD}}
build-browser () {

  local +x OUTPUT="lib/browser/build/browser.js"
  local +x browser_results="tmp/browser.js.results"
  local +x names="$(ls -d lib/common/*/) lib/browser/dom lib/browser/data-do"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".*
  rm -f "$browser_results"

  temp="$TEMP/spec"

  # === BROWSER: ==============================================================

  mksh_setup BOLD "=== Building: {{$OUTPUT}}"

  paste --delimiter=\\n --serial \
    bower_components/jquery/dist/jquery.min.js   \
    bower_components/lodash/dist/lodash.min.js    \
    bower_components/mustache.js/mustache.min.js   \
    bower_components/form-to-obj/form-to-obj.min.js \
    bower_components/alite/alite.min.js              \
    > "$OUTPUT".head

  paste --delimiter=\\n --serial \
    $(find-build-files top    $names)   \
    > "$OUTPUT".body

  local +x IFS=$'\n'
  local +x LAST_CAT=""
  for FILE in $(find-build-files body   $names) ; do
    local +x NAME="$(basename $FILE .js)"
    local +x CATEGORY=$(basename "$(dirname "$FILE")")
    CATEGORY=${CATEGORY//"-"/"_"}
    if [[ "$LAST_CAT" != "$CATEGORY" ]]; then
      echo -e "\nfuncs.${CATEGORY} = {};" >> "$OUTPUT".body
      LAST_CAT="$CATEGORY"
    fi
    echo -e "\nfuncs.${CATEGORY}.${NAME}=${NAME};" >> "$OUTPUT".body
    cat "$FILE" >> "$OUTPUT".body
  done

  paste --delimiter=\\n --serial \
    $(find-build-files bottom $names)     \
    >> "$OUTPUT".body

  paste --delimiter=\\n --serial "$OUTPUT".head "$OUTPUT".body > "$OUTPUT"

  local +x IFS=' '
  js_setup jshint lib/browser/build/browser.js.body $(find lib/browser/specs/ -type f -name "*.js" -and -not -name "browser.js" -print | tr '\n' ' ') || {
    stat=$?;
    mksh_setup RED "{{Failed}} jshint";
    exit $stat;
  }

  server start

  mksh_setup BOLD "-n" "=== Refreshing {{http://localhost:$(server port)/specs.html}} to re-run specs"

  local waiting=0
  while [[ $waiting -lt 30 ]] && ! gui_setup reload-browser google-chrome "Dum" 2>/dev/null && ! gui_setup reload-browser google-chrome "specs.html" 2>/dev/null; do
    echo -n "."
    waiting=$(($waiting + 1))
    sleep 0.5
  done
  echo ""
  if [[ $waiting -gt 29 ]]; then
    mksh_setup RED "=== {{Failed}} opening: BOLD{{$(server index)}}"
    exit 1
  fi

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


