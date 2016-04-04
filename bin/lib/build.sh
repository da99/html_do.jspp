
source "$THIS_DIR/bin/lib/test-html.sh"
source "$THIS_DIR/bin/lib/build-node.sh"
source "$THIS_DIR/bin/lib/build-browser.sh"

# === {{CMD}}
# === This is a shortcut  build-node, build-browser, test-html
build () {

  test-html
  build-node
  build-browser

} # === end function
