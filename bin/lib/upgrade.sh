
# === upgrade
upgrade () {
  $0 install_html_validator
  cd "$THIS_DIR"
  js_setup upgrade
  bower update --force-latest
} # === end function
