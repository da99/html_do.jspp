
source "$THIS_DIR/bin/lib/ugly.sh"

# === {{CMD}}
# === This is a shortcut  build-nodejs, build-browserjs, test-html
build () {

  test-html
  build-nodejs
  build-browserjs

} # === end function
