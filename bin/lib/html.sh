
# === {{CMD}} dum-dum.file.html  output/dir/   public/dir/
# === {{CMD}} --template dum-dum.file.html  --output-dir my/dir/  --public-dir
html () {
  node $THIS_DIR/lib/html/html.js "$@"

  local +x OUTPUT_DIR="$(mksh_setup read-arg --template "$@")";   shift
  local +x IFS=$'\n'

  local +x SCRIPTS="$(find "$OUTPUT_DIR" -type f -name "*.js")"
  if [[ ! -z "$SCRIPTS" ]]; then
    for FILE in $SCRIPTS; do
      js_setup eslint $FILE
    done
  fi
  # TODO: remove duplicate nodes: link, src, meta
  # vnu="$(echo tmp/validator/*/dist/vnu.jar)"
  # final="$(node $THIS_DIR/lib/html/html.js $THE_ARGS)"
  # # === If <body is found, validate whole document:
  # if echo "$final" | grep -i '<body' &>/dev/null; then
  #   echo "$final" | java -jar "$vnu" - || { stat="$?"; echo $action 1>&2; exit $stat; }
  # fi
  # echo "$final"
} # === end function
