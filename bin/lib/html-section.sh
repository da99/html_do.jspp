
# === {{CMD}}   STYLE|FOOT|...   path/to/file
# === cat path/to/file | {{CMD}}   STYLE|FOOT|...
html-section () {
  section="$1"; shift
  grep  -Pzo '(?s)^\<!--\s+'$section'\s+-->\s?\n\K(.+?)(?=\n<!--|\Z)' $@
}

