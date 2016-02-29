
duplicate-functions () {
  # === duplicate_functions
  files="$(find lib/ -type f -iname "_.*.js" -prune -o -iname "*.js" -print | \
    xargs -I FILE basename FILE |  \
    sort                        |  \
    uniq -c                     |  \
   grep -v --extended-regexp '^\s+1' | \
   tr -s ' ' | cut -d' ' -f3 || :)"
  if [[ -z "$files" ]]; then
    exit 0
  else
    while read NAME; do
      echo lib/*/$NAME | tr ' ' '\n'
    done < <( echo "$files" )
    exit 1
  fi
} # === end function
