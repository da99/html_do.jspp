
# === {{CMD}}  major|minor|patch
# === runs `js_setup upgrade`, then `{{BIN}} build`, then runs `js_setup bump-commit $@`
bump-commit () {

  local +x NEW_VERSION="$(my_git bump $@)"
  local +x NEW_NUM=${NEW_VERSION/v/}

  sh_color BOLD "=== {{Bumping}} to $NEW_VERSION"

  sh_color BOLD "=== Upgrading..."
  js_setup js_clean
  js_setup upgrade
  my_git should-be-clean

  sh_color BOLD "=== Building and testing..."
  $0 build

  sh_color BOLD "=== Updating {{package.json}}..."
  js_setup update-key "package.json" "version" "$NEW_NUM"

  sh_color BOLD "=== Bumping and pushing..."
  git add package.json
  git commit -m "Bump: $NEW_VERSION"
  git tag "$NEW_VERSION"
  my_git push-latest-version
} # === end function
