
source "$THIS_DIR/bin/lib/ugly.sh"

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

  cat                             \
    $($0 top-build-files $names)   \
    $($0 body-build-files $names)   \
    $($0 bottom-build-files $names)  \
    > "$OUTPUT"

  jshint www/*.js || { stat=$?; mksh_setup RED "{{Failed}}"; exit $stat; }

  echo -n -e "=== Refreshing ${Orange}browser${Color_Off}... "
  { gui_setup reload-browser google-chrome "Dum" && echo -e "${Green}Done${Color_Off}"; } ||
    { mksh_setup RED "=== {{Failed}}"; exit 1; }

  local count="0"
  while [[ ! -s "$browser_results" && $count -lt 100 ]]; do
    count=$((count + 1))
    sleep 0.1
  done
  if [[ -s "$browser_results" ]]; then
    echo -e "=== Browser specs: ${Green}$(cat "$browser_results")${Color_Off}"
  else
    mksh_setup RED "=== Browser specs: {{Failed}}"
    exit 1
  fi

  mksh_setup GREEN "=== Done building: {{$OUTPUT}}"

} # === end function


