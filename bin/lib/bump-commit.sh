
# === {{CMD}}  major|minor|patch
# === runs `js_setup upgrade`, then `{{BIN}} build`, then runs `js_setup bump-commit $@`
bump-commit () {

  local +x NEW_VERSION="$(git_setup bump $@)"
  local +x NEW_NUM=${NEW_VERSION/v/}

  mksh_setup BOLD "=== {{Bumping}} to $NEW_VERSION"

  mksh_setup BOLD "=== Upgrading..."
  js_setup js_clean
  js_setup upgrade
  git_setup should-be-clean

  mksh_setup BOLD "=== Building and testing..."
  $0 build

  mksh_setup BOLD "=== Updating {{package.json}}..."
  js_setup update-key "package.json" "version" "$NEW_NUM"

  mksh_setup BOLD "=== Bumping and pushing..."
  git add package.json
  git commit -m "Bump: $NEW_VERSION"
  git_setup push-latest-version
} # === end function
