
# === __ build-files  [dom|node|etc.]
build-files () {
  for name in $@; do
    dir="lib/$name"
    echo "$(top-bottom-build-files)" $($0 body-build-files $name)
  done
} # === end function
