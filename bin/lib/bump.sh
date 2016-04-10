
# === {{CMD}}  major|minor|patch
# === runs `js_setup upgrade`, then `{{BIN}} bin`, then runs `js_setup bump $@`
bump () {
  mksh_setup BOLD "=== Upgrading..."
  js_setup upgrade

  mksh_setup BOLD "=== Building and testing..."
  $0 build

  mksh_setup BOLD "=== {{Bumping}} $@"
  js_setup bump $@
} # === end function
