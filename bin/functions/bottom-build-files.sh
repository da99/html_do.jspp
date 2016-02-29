
# === {{CMD}}  [dom|node|etc.]
bottom-build-files () {
  for name in $@; do
    dir="lib/$name"
    bottom="$dir/_.bottom.js"
    [[ ! -f "$bottom" ]] && touch "$bottom" || :
    echo $bottom
  done
} # === end function
