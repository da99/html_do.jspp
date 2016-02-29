
# === {{CMD}} [dom|base|etc.]   "my text"
prepend-to () {
    name="$1"; shift
    text="$@"
    [[ -z "$text" ]] && echo '!!! Text is missing.' 1>&2 && exit 1 || :
    for FILE in $($0 build-files $name); do
      new_content="$text\n$(cat "$FILE")"
      echo -e "$new_content" > "$FILE"
      echo "=== $FILE"
    done
} # === end function
