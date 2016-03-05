
test-browser-js () {

  # === BROWSER: ==============================================================
  $0 server start

  local OUTPUT="build/browser.js"
  local BROWSER_ERROR="tmp/catch.browser.js.txt"
  local browser_results="tmp/browser.js.results"

  rm -rf "$BROWSER_ERROR"
  rm -rf "$OUTPUT"
  rm -rf "$OUTPUT".map
  rm -f "$browser_results"


  echo -e "=== Building: ${Bold}browser.js${Color_Off}"
  names="spec base state dom data-do"
  # ugly "browser"  $names
  cat                             \
    $($0 top-build-files $names)   \
    $($0 body-build-files $names)   \
    $($0 bottom-build-files $names)  \
    > build/browser.js

  jshint www/*.js || { stat=$?; echo -e "${Red}Failed${Color_Off}"; exit $stat; }

  echo -n -e "=== Refreshing ${Orange}browser${Color_Off}"

  local waiting=0
  while [[ $waiting -lt 30 ]] && ! gui_setup reload-browser google-chrome "Dum" 2>/dev/null; do
    echo -n "."
    waiting=$(($waiting + 1))
    sleep 0.5
  done

  echo ""

  if [[ $waiting -gt 29 ]]; then
    echo -e "=== ${Red}Failed${Color_Off}"
    exit 1
  fi

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
  $0 server stop

} # end function test-browser-js
