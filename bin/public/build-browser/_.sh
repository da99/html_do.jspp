
source "$THIS_DIR/bin/public/find-build-files/_.sh"
source "$THIS_DIR/bin/public/server/_.sh"

# === {{CMD}}
build-browser () {
  cd "$THIS_DIR"

  local +x OUTPUT="lib/browser/build/browser"
  local +x browser_results="tmp/browser.js.results"
  local +x names="$(ls -d lib/common/*/) lib/browser/dom lib/browser/data-do"

  rm -f "$OUTPUT"
  rm -f "$OUTPUT".*
  rm -f "$browser_results"

  temp="$TEMP/spec"

  # === BROWSER: ==============================================================

  sh_color BOLD "=== Building: {{$OUTPUT}}"

  paste --delimiter=\\n --serial \
    bower_components/jquery/dist/jquery.min.js   \
    bower_components/lodash/dist/lodash.min.js    \
    bower_components/mustache.js/mustache.min.js   \
    bower_components/form-to-obj/form-to-obj.min.js \
    bower_components/alite/alite.min.js              \
    > "$OUTPUT".vendor

  paste --delimiter=\\n --serial \
    $(find-build-files top    $names)   \
    > "$OUTPUT".head

  local +x IFS=$'\n'
  local +x LAST_CAT=""
  local +x LAST_MAIN=""

  write_to_body () {
    tee -a "$OUTPUT".body "$OUTPUT".browser.body >/dev/null
  }

  for FILE in $(find-build-files body   $names) ; do
    local +x NAME="$(basename $FILE .js)"
    local +x MAIN="$(echo "$FILE" | cut -d'/' -f2 )"
    local +x CATEGORY="$(echo "$FILE" | cut -d'/' -f3 )"

    local +x THIS_CAT="${CATEGORY}"
    THIS_CAT=${THIS_CAT//"-"/"_"}

    local +x THIS_MAIN="$MAIN"
    THIS_MAIN=${THIS_MAIN//"-"/"_"}

    if [[ "$LAST_MAIN" != "$THIS_MAIN" ]]; then
      echo -e "\nfuncs.${MAIN}     = {};" | write_to_body
      LAST_MAIN="$THIS_MAIN"
    fi

    if [[ "$LAST_CAT" != "$THIS_CAT" ]]; then
      echo -e "\nfuncs.${MAIN}.${THIS_CAT} = {};"  | write_to_body
      LAST_CAT="$THIS_CAT"
    fi

    echo -e "\nfuncs.${MAIN}.${THIS_CAT}.${NAME}=${NAME};"  | write_to_body
    grep -Pzo '(?s)function\ '${NAME//'$'/'\$'}'\(.+'  "$FILE"  >> "$OUTPUT".browser.body
    cat "$FILE" >> "$OUTPUT".body
  done # === for

  paste --delimiter=\\n --serial \
    $(find-build-files bottom $names)     \
    > "$OUTPUT".tail

  paste --delimiter=\\n --serial                  "$OUTPUT".head "$OUTPUT".body         "$OUTPUT".tail > "$OUTPUT".no.vendor.js
  paste --delimiter=\\n --serial "$OUTPUT".vendor "$OUTPUT".head "$OUTPUT".body         "$OUTPUT".tail > "$OUTPUT".with.specs.js
  paste --delimiter=\\n --serial "$OUTPUT".vendor "$OUTPUT".head "$OUTPUT".browser.body "$OUTPUT".tail > "$OUTPUT".js

  local +x IFS=' '
  js_setup jshint "$OUTPUT".no.vendor.js $(find lib/browser/specs/ -type f -name "*.js" -and -not -name "browser.js" -print | tr '\n' ' ') || {
    stat=$?;
    sh_color RED "{{Failed}} jshint";
    exit $stat;
  }

  server restart $THIS_DIR/lib/browser/specs /browser.with.specs.js

  sh_color BOLD "-n" "=== Refreshing {{http://localhost:$(server port)/specs}} to re-run specs"

  local waiting=0
  while [[ $waiting -lt 30 ]] && ! gui_setup reload-browser google-chrome "Dum" 2>/dev/null && ! gui_setup reload-browser google-chrome "specs" 2>/dev/null; do
    echo -n "."
    waiting=$(($waiting + 1))
    sleep 0.5
  done
  echo ""
  if [[ $waiting -gt 29 ]]; then
    sh_color RED "=== {{Failed}} opening: BOLD{{$(server index)}}"
    exit 1
  fi

  local count="0"
  while [[ ! -s "$browser_results" && $count -lt 100 ]]; do
    count=$((count + 1))
    sleep 0.1
  done

  if [[ -s "$browser_results" ]]; then
    sh_color GREEN "=== Browser specs: {{$(cat "$browser_results")}}"
  else
    sh_color RED "!!! Browser specs: {{Failed}}"
    exit 1
  fi

  sh_color GREEN "=== Done building: {{$OUTPUT}}.js            $(($(stat --printf="%s" "$OUTPUT".js)            / 1024)) Kb"
  sh_color GREEN "=== Done building: {{$OUTPUT}}.with.specs.js $(($(stat --printf="%s" "$OUTPUT".with.specs.js) / 1024)) Kb"

} # === end function


