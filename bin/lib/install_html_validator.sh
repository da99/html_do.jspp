
# === {{CMD}}
install_html_validator () {
    cd "$THIS_DIR"
    mkdir -p tmp/validator
    cd tmp/validator
    rm -rf dist
    zip_url="$(wget -qO-  https://api.github.com/repos/validator/validator/releases/latest | grep browser_ | cut -d\" -f4 | head -n 1)"
    file_name="$(basename "$zip_url")"
    dir_name="$(basename "$zip_url" ".zip")"
    if [[ -d "$dir_name" ]]; then
      echo "=== Already installed vnu: $dir_name"
      exit 0
    fi
    trash-put vnu.jar* || : # Remove old files/dirs because they take lots of space.
    wget "$zip_url"
    unzip "$file_name" -d "$dir_name"
} # === end function
