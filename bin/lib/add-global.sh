
# === {{CMD}}  dir
# === {{CMD}}  file
add-global () {
  if [[ -d "$1" ]]; then
    local dir
    dir="$1"; shift
    while read FILE; do
      add-global "$FILE" "$@"
    done < <(find "$dir" -type f -iname "*.js")
    return 0
  fi

  local FILE content
  FILE="$1";    shift
  content="$@"; shift
  new_content="/* globals $content */"

  if [[ ! -s "$FILE" ]]; then
    echo -e "=== Skipping empty file: ${Bold}$FILE${Color_Off}"
    return 0
  fi

  if grep -P '/* globals ' "$FILE" | grep -P '[\s,]'$content'[\s,]' &>/dev/null; then
    echo -e "=== Already has global: $content ${Bold}$FILE${Color_Off}"
    return 0
  fi

  line="$(grep -n '/\* ' "$FILE" | tail -n 1 || :)"
  if [[ -z "$line" ]]; then
    echo "!!! No jshint comment found: $FILE" 1>&2
    exit 1
  fi

  line_num="$(echo "$line" | cut -d':' -f1)"
  sed -i "$(($line_num + 1))i ${new_content}" "$FILE"
  echo -e "=== Added to: ${Bold}$FILE${Color_Off} ($new_content)"
}
