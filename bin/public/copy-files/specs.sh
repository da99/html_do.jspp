
specs () {
  local +x TEMP="/tmp/dum_dum_boom_boom"
  rm -rf "$TEMP"
  mkdir -p "$TEMP"
  cd "$TEMP"

  mkdir from
  mkdir to

  cd from
  touch file.gif
  touch file.css
  touch file.png

  cd ..
  local +x CMD="dum_dum_boom_boom copy-files  from  to"
  $CMD
  should-match "$(ls to -1 | sort)"  "$(echo -e "file.css\nfile.gif\nfile.png")"  "$CMD"
}

specs
