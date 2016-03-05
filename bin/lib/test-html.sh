
# === {{CMD}}
# ==  {{CMD}}  spec/dir
test-html () {
  if [[ -s "$TEMP/last_failed" ]]; then
    last_failed="$(cat "$TEMP/last_failed")"
  else
    last_failed=""
  fi

  if [[ -z "$@" ]]; then # ==================================================

    js_setup jshint lib/html.js

    while read DIR; do

      if [[ -n "$last_failed" && "$last_failed" != "$DIR" ]]; then
        continue
      fi

      $0 test-html "$DIR" || { stat="$?"; echo "$DIR" > "$TEMP/last_failed"; exit $stat; }

      if [[ -n "$last_failed" ]]; then
        rm -f "$TEMP/last_failed"
        break
      fi

    done < <(find html_specs/ -maxdepth 1 -mindepth 1 -type d)

    if [[ -z "$last_failed" ]]; then
      bash_setup GREEN "=== All pass."
    else
      echo "=== Starting over all other tests: "
      $0 test-html
    fi

    exit 0
  fi # ======================================================================

  DIR="$1"; shift
  ACTUAL="$TEMP/actual"

  rm -rf "$ACTUAL"; mkdir -p "$ACTUAL" # === Re-set sandbox:

  echo -e "=== Testing: ${Bold}$DIR${Color_Off}"
  for FILE in "$DIR/input"/*.html; do
    [[ "$(basename "$FILE")" == _.* ]] && continue || :
    { [[ ! -f "$FILE" ]] && echo "=== No html files." && exit 1; } || :

    { $0 html "$FILE" "$ACTUAL" "$TEMP"; } || \
      { stat=$?; bash_setup RED "=== Failed ($stat)"; exit $stat; }
  done

  if ! bash_setup dirs-are-equal "$ACTUAL" "$DIR/expect"; then
    bash_setup RED "=== Failed"
    exit 1
  else
    tput cuu1; tput el
    echo -e "=== ${Green}$DIR${Color_Off}"
  fi

  # echo -e "=== split: $Green$FILE$Reset"

} # end function test-html
