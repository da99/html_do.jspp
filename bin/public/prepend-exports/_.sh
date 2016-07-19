
# === {{CMD}}  /path/to/dir  path/to/dir
prepend-exports () {
  local +x DIRS="$@"

  for FILE in $DIRS; do
    if [[ "$FILE" == */_.*.js ]]; then
      continue
    fi

    funcs_line_nums="$(grep -Po --line-number '^function\s+\K(.+?)(?=\()' "$FILE")"

    if [[ -z "$funcs_line_nums" ]]; then
      continue
    fi

    grep 'exports.'  "$FILE" && { echo "=== Skipping: $FILE"; continue; } || :
    grep 'private ' "$FILE" && { echo "=== Skipping private: $FILE";  continue; } || :

    echo -e "$funcs_line_nums" | while IFS=':' read LINE NAME; do
      new_content="exports.${NAME} = ${NAME};"
      mksh_setup BOLD "=== {{ADDING}}: $new_content -> $FILE"
      sed -i "${LINE}i $new_content" "$FILE"
    done
  done
}
