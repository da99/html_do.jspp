
# === {{CMD}}  top|bottom|body|file.name.js  dom state etc.
find-build-files () {
  cd lib
  local +x NAME="$1"; shift
  local +x CMD="find $@ -maxdepth 2 -mindepth 2 -type f "

  case "$NAME" in
    top|bottom)
      $CMD -name "_.${NAME}.js"
      ;;

    body)
      $CMD -type f -iname "_.*.js" -prune -o -iname "*.js" -print
      ;;

    *)
      local +x FILES="$($CMD -name "$NAME" -print)"
      if [[ -z "$FILES" ]]; then
        mksh_setup RED "!!! Build files not found: {{$NAME}}"
        exit 1
      fi
      echo "$FILES"
      ;;
  esac

} # === end function
