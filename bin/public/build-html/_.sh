
# === {{CMD}} dum-dum.file.html  my/output/dir/  public/dir/
# === {{CMD}} input/dir          my/output/dir/  public/dir
build-html () {
  node $THIS_DIR/lib/html/build-html.js "$@" | xargs -I NEW_FILE sh_color GREEN "=== {{wrote}}: NEW_FILE"

  # vnu="$(echo tmp/validator/*/dist/vnu.jar)"
  # final="$(node $THIS_DIR/lib/html/html.js $THE_ARGS)"
  # # === If <body is found, validate whole document:
  # if echo "$final" | grep -i '<body' &>/dev/null; then
  #   echo "$final" | java -jar "$vnu" - || { stat="$?"; echo $action 1>&2; exit $stat; }
  # fi
  # echo "$final"
} # === end function




