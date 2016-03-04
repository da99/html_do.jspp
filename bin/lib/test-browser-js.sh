
test-browser-js () {

  local OUTPUT="build/browser.js"
  local browser_results="tmp/browser.js.results"

  rm -rf "$OUTPUT"
  rm -rf "$OUTPUT".map
  rm -f "$browser_results"

  # === BROWSER: ==============================================================

  echo -e "=== Building: ${Bold}browser.js${Color_Off}"
  names="spec base state dom data-do"
  # ugly "browser"  $names
  cat                             \
    $($0 top-build-files $names)   \
    $($0 body-build-files $names)   \
    $($0 bottom-build-files $names)  \
    > build/browser.js

  jshint www/*.js || { stat=$?; echo -e "${Red}Failed${Color_Off}"; exit $stat; }

  echo -n -e "=== Refreshing ${Orange}browser${Color_Off}... "
  { gui_setup reload-browser google-chrome "Dum" && echo -e "${Green}Done${Color_Off}"; } ||
    { echo -e "=== ${Red}Failed${Color_Off}"; exit 1; }

  local count="0"
  while [[ ! -s "$browser_results" && $count -lt 100 ]]; do
    count=$((count + 1))
    sleep 0.1
  done
  if [[ -s "$browser_results" ]]; then
    echo -e "=== Browser specs: ${Green}$(cat "$browser_results")${Color_Off}"
  else
    echo -e "=== Browser specs: ${Red}Failed${Color_Off}" 1>&2
    exit 1
  fi

  echo -e "=== Done building: ${Green}browser.js${Color_Off}"

} # end function test-browser-js
