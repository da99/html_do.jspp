
# === upgrade
upgrade () {
  cd "$THIS_DIR"
  js_setup upgrade
  bower update --force-latest
} # === end function
