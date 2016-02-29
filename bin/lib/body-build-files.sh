
# === {{CMD}}  [dom|node|etc.]
body-build-files () {
    for name in $@; do
      dir="lib/$name"
      find "$dir" -type f -iname "_.*.js" -prune -o -iname "*.js" -print
    done
} # === end function
