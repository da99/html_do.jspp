
# === {{CMD}}  path/to/file
# === cat path/to/file | {{CMD}}  no-section
html-no-section () {
  grep  -Pzo '(?s)(\A.+?)(?=\n\<!--)' $@
}

