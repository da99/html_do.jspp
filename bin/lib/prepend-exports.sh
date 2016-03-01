
prepend-exports () {
  for FILE in lib/base/*.js lib/node/*.js lib/state/*.js lib/spec/*.js; do
    [[ "$FILE" == */_.*.js ]] && continue || :
    funcs_line_nums="$(grep -Po --line-number '^function\s+\K(.+?)(?=\()' "$FILE")"
    [[ -z "$funcs_line_nums" ]] && continue || :
    grep 'exports.'  "$FILE" && { echo "=== Skipping: $FILE"; continue; } || :
    grep 'private ' "$FILE" && { echo "=== Skipping private: $FILE";  continue; } || :
    while IFS=':' read LINE NAME; do
      new_content="exports.${NAME} = ${NAME};"
      echo -e "=== ${Bold}ADDING${Color_Off}: $new_content -> $FILE"
      sed -i "${LINE}i $new_content" "$FILE"
    done < <(echo -e "$funcs_line_nums")
  done
}
