
# === {{CMD}} file
duplicate-functions () {

  local +x IFS=$'\n'

  local +x dups="$(
    find lib/*/* -type f -name "_.*.js" -o -path "lib/html/specs/*"  -o -path "*/build/*.js" -prune -o -path "lib/*/*/*.js" -and -name "*.js" -print | \
      xargs -I FILE basename FILE       | \
      sort                              | \
      uniq --count                      | \
      grep -v --extended-regexp '^\s+1' | \
      tr -s ' '                         | \
      cut -d' ' -f3 || :
  )"

  if [[ -z "$dups" ]]; then
    return 0
  fi

  local +x IFS=$'\n'
  for NAME in $dups; do
    find lib/ -type f -name "$(basename "$NAME")"
  done

  exit 1
} # === end function





