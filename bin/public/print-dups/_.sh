
# === {{CMD}}
print-dups () {
  file="$1"; shift
  cat "$file" | grep --extended-regexp '^\s*function\s+[^\s]+\(' | sed -e 's/^[ \t]*//' | tr -s ' ' | cut -d' ' -f 2 | cut -d'(' -f 1 | uniq -c | sort | grep -v --extended-regexp '\s+1'
} # === end function
