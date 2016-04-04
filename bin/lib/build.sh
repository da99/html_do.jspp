
source "$THIS_DIR/bin/lib/test-html.sh"
source "$THIS_DIR/bin/lib/build-node.sh"
source "$THIS_DIR/bin/lib/build-browser.sh"
source "$THIS_DIR/bin/lib/duplicate-functions.sh"

# === {{CMD}}
# === This is a shortcut  build-node, build-browser, test-html
build () {

  duplicate-functions || { stat="$?"; echo "!!! Dup found." 1>&2; exit $stat; }


  build-browser
  mksh_setup BOLD "\n{{=======================================================================}}\n"

  # === Note: test-html is dependent on build-node to produce the node.js file
  # === it needs.
  build-node

  mksh_setup BOLD "\n{{=======================================================================}}\n"
  test-html

} # === end function
