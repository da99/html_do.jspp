
# === {{CMD}}  [dom|node|etc.]
top-build-files () {
  for name in $@; do
    dir="lib/$name"
    top=$dir/_.top.js
    [[ ! -f "$top"    ]] && touch "$top"    || :
    echo $top
  done
} # === end function
