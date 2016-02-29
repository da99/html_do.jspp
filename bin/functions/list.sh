
# === {{CMD}}  path_to_file # List functions
list () {
  file="$1"; shift
  while read -r one two; do
    echo -e "$BRed$two$Reset" "$one"
  done < <(cat -n "$file" \
    | grep --extended-regexp '^\s+[0-9]+\sfunction\s+[^\(\)]+' \
    | sort -k2 \
    | grep --extended-regexp '\s+[^\( ]+\(' \
    | cut -d\( -f1 \
    | tr '\t' ' '  \
    | tr --squeeze-repeats ' ' \
    | tr ' ' '\t'  \
    | cut -f2,4 )

  # paste <(echo "$cols" | cut -f4) <(echo "$cols" | cut -f2)
    # | grep --color --extended-regexp '\s+.+' \
} # === end function
