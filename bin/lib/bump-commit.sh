
# === {{CMD}}  major|minor|patch
# === runs `js_setup upgrade`, then `{{BIN}} build`, then runs `js_setup bump-commit $@`
bump-commit () {
  mksh_setup BOLD "=== Upgrading..."
  js_setup upgrade

  mksh_setup BOLD "=== Building and testing..."
  $0 build

  mksh_setup BOLD "=== {{Bumping}} $@"
  js_setup bump-commit $@
} # === end function
