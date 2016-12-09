
source "$THIS_DIR/bin/public/test-html/_.sh"
source "$THIS_DIR/bin/public/build-node/_.sh"
source "$THIS_DIR/bin/public/build-browser/_.sh"
source "$THIS_DIR/bin/public/duplicate-functions/_.sh"

# === {{CMD}}
# === This is a shortcut  build-node, build-browser, test-html
build () {

  $0 duplicate-functions || { stat="$?"; sh_color RED "!!! {{Dup found}}."; exit $stat; }


  build-browser
  sh_color BOLD "\n{{=======================================================================}}\n"

  # === Note: test-html is dependent on build-node to produce the node.js file
  # === it needs.
  build-node

  sh_color BOLD "\n{{=======================================================================}}\n"
  test-html

} # === end function
