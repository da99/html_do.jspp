
# === {{CMD}}  top|bottom|body|file.name.js  dom state etc.
find-build-files () {
  local +x NAME="$1"; shift
  local +x CMD="find $@ -maxdepth 1 -mindepth 1 -type f "

  case "$NAME" in
    top|bottom)
      $CMD -name "_.${NAME}.js"
      ;;

    body)
      $CMD -type f -iname "_.*.js" -prune -o -iname "*.js"
      ;;

    *)
      local +x FILES="$($CMD -name "$NAME")"
      if [[ -z "$FILES" ]]; then
        mksh_setup RED "!!! Build files not found: {{$NAME}}"
        exit 1
      fi
      echo "$FILES"
      ;;
  esac

} # === end function
