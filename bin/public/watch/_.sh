
source "$THIS_DIR/bin/public/server/_.sh"

# === {{CMD}}
# === {{CMD}} "cmd with args"
watch () {
  local +x CMD="$@"
  local +x FILES="$PWD -r lib/ bin/"

  sh_color BOLD "=== Watching: {{$FILES}} CMD: {{$CMD}}"
  $CMD || :

  inotifywait --quiet --monitor --exclude .git/ --event close_write $FILES | while read -r CHANGE; do
    dir=$(echo "$CHANGE" | cut -d' ' -f 1)
    path="${dir}$(echo "$CHANGE" | cut -d' ' -f 3)"
    file="$(basename $path)"


    # === NOTE: We exclude 'build/' files to prevent an endless loop.
    if [[ "$path" == */build/* ]]; then
      sh_color ORANGE  "=== Skipping: {{$CHANGE}}"
    fi

    if [[ ! -f "$path" ]]; then
      sh_color BOLD "=== Skipping {{non-file}}: $CHANGE"
      continue
    fi

    if [[ "$path" == *"/bin/public/watch/_.sh" ]]; then
      sh_color ORANGE "=== watch.sh changed. {{Reloading}}..."
      exec $0 watch "$CMD"
    fi

    sh_color ORANGE "=== Changed: {{$path}} ($CHANGE)"

    if [[ "$path" == "*.js" ]]; then
      js_setup jshint "$path" && "$CMD" || :
      continue
    fi

    $CMD || :
  done # === while

  return 0 # ===================================================================
  # mksh_setup watch "-r bin -r lib --exclude /build/" "$@"

  local BROWSER_ERROR="tmp/catch.browser.js.txt"
  # for FILE in $(git ls-files --cached --others --exclude-standard | grep --extended-regexp '.js|.html|bin'); do
  #   [[ -f "$FILE" ]] && mksh_setup is-same-file "$FILE" || :
  # done
  echo "" > "$TEMP/CHANGE"

  cmd="$@"
  run_cmd () {
    $cmd && sh_color GREEN "=== {{$cmd}}" || sh_color RED "=== {{Failed}}"
  }

  server restart

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
    if [[ ! -f "$path" ]]; then
      continue
    fi

    if [[ "$path" == */build/* ]]; then
      continue
    fi

    # === Browser errors:
    if [[ "$path" == "$BROWSER_ERROR" ]]; then
      cat "$BROWSER_ERROR" | js_setup map-errors-to-files lib/
      continue
    fi

    # Check if file has changed:
    if mksh_setup is-same-file "$path"; then
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
        server restart
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

  $0 server quit
  $0 "$THE_ARGS"

} # === end function

