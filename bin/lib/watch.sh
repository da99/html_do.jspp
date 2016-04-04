
source "$THIS_DIR/bin/lib/server.sh"

# === {{CMD}}
# === {{CMD}} "cmd with args"
watch () {
  local BROWSER_ERROR="tmp/catch.browser.js.txt"
  # for FILE in $(git ls-files --cached --others --exclude-standard | grep --extended-regexp '.js|.html|bin'); do
  #   [[ -f "$FILE" ]] && mksh_setup is_same_file "$FILE" || :
  # done
  echo "" > "$TEMP/CHANGE"

  cmd="$@"
  run_cmd () {
    $cmd && mksh_setup GREEN "=== {{$cmd}}" || mksh_setup RED "=== {{Failed}}"
  }

  server start

  if [[ -z "$cmd" ]]; then
    $0 test || :
  else
    run_cmd
  fi

  echo -e "\n=== Watching:"

  inotifywait --quiet --monitor --event close_write $PWD -r lib/ bin/ | while read -r CHANGE; do
    dir=$(echo "$CHANGE" | cut -d' ' -f 1)
    path="${dir}$(echo "$CHANGE" | cut -d' ' -f 3)"
    file="$(basename $path)"
    echo "" > "$TEMP/CHANGE"

    # Make sure this is not a temp/swap file:
    { [[ ! -f "$path" ]] && continue; } || :

    # === Browser errors:
    if [[ "$path" == "$BROWSER_ERROR" ]]; then
      cat "$BROWSER_ERROR" | js_setup map-errors-to-files lib/
      continue
    fi

    # Check if file has changed:
    if mksh_setup is_same_file "$path"; then
      echo "=== No change: $CHANGE"
      continue
    fi # === Has file changed?

    # File has changed:
    echo -e "\n=== $CHANGE ($path)"

    if [[ "$path" == bin/* ]]; then
      echo "=== Reloading..."
      break
    fi

    echo "$path" > "$TEMP/CHANGE"

    if [[ "$path" == lib/html/specs/**/*.html || "$path" == lib/html/specs/**/*.json ]]; then
      { $0 test-html lib/html/specs/"$(echo "$path" | cut -d'/' -f2)" && $0 test-html; } || :
      continue
    fi

    if [[ "$path" == lib/browser/specs/*.js ]]; then
      js_setup jshint "$path" || continue
      if server is-running; then
        server start
      fi
    fi

    # if [[ "$path" =~ "lib/browser/specs/" ]]; then
    #   { gui_setup reload-browser google-chrome "Dum"; } || :
    #   continue
    # fi

    if [[ "$path" == *.js ]]; then
      js_setup jshint "$path"
    fi

    if [[ -n "$cmd" ]]; then
      run_cmd
    fi
  done

  $0 server stop
  $0 "$THE_ARGS"

} # === end function

