
source "$THIS_DIR/bin/lib/test-html.sh"
source "$THIS_DIR/bin/lib/build-nodejs.sh"
source "$THIS_DIR/bin/lib/build-browserjs.sh"

# === {{CMD}}
# === This is a shortcut  build-nodejs, build-browserjs, test-html
build () {

  test-html
  build-nodejs
  build-browserjs

} # === end function
