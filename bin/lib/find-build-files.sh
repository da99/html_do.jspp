
# === {{CMD}}  top|bottom|body|file.name.js  dom state etc.
find-build-files () {
  cd lib
  local +x NAME="$1"; shift
  local +x CMD="find $@ -maxdepth 1 -mindepth 1 -type f "
  local +x TAIL="  -exec readlink -m {} ; "

  case "$NAME" in
    top|bottom)
      $CMD -name "_.${NAME}.js"  $TAIL
      ;;

    body)
      $CMD -type f -iname "_.*.js" -prune -o -iname "*.js" $TAIL
      ;;

    *)
      local +x FILES="$($CMD -name "$NAME" $TAIL)"
      if [[ -z "$FILES" ]]; then
        mksh_setup RED "!!! Build files not found: {{$NAME}}"
        exit 1
      fi
      echo "$FILES"
      ;;
  esac

} # === end function
