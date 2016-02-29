
# === {{CMD}}  "lib/file.js"
functions-to-files () {
  file="$1"; shift
  dir="$(dirname "$file")/$(basename "$file" ".js")"
  content=""
  function_name=""

  if $0 functions_already_extracted "$file"; then
    echo "!!! Dups found" 1>&2
  fi

  while IFS= read -r LINE; do
    content="$content\n$LINE"
    if [[ -z "$function_name" ]]; then
      function_name="$(echo "$LINE" | js_setup function-names-in_file || :)"
    fi
    if ! { echo "$LINE" | grep --extended-regexp '(^\}(\s|$))|(^function .+\}$)' &>/dev/null; } then
      continue
    fi

    new_file="$dir/${function_name}.js"
    echo -e "$content"

    if [[ -s "$new_file" ]] && diff <(echo -e "$content") "$new_file" ; then
      echo "=== Already processed: $function_name" 1>&2
    else
      if [[ -s "$new_file" ]]; then
        echo "!!! File exists: $new_file" 1>&2
        exit 1
      fi
      echo -e -n  "=== Writing to ${Bold}${function_name}${Color_Off} -> ${new_file}" 1>&2;
      sleep 1; echo -n "." 1>&2; sleep 1; echo -n "." 1>&2;
      sleep 1; echo -n "." 1>&2; sleep 1; echo -n "." 1>&2;
      sleep 1; echo -n "." 1>&2; sleep 1; echo -n "." 1>&2;
      echo -e "$content" >> "$new_file"
    fi

    content=""
    function_name=""
  done < <(cat "$file")

  echo ""

  if [[ -n "$content" ]]; then
    bottom="$dir/_.bottom.js"
    echo -e "$content" >> "$bottom"
    echo -e "\n\n=== NOTE: Wrote to $bottom\n\n"
  fi


  echo "=== Trashing: $file" 1>&2
  trash-put "$file"
}  # === end function
