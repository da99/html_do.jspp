
specs () {
  local +x TMP="/tmp/dum_dum_boom_boom"
  reset-fs () {
    rm -rf "$TMP"
    mkdir -p "$TMP"
  }

  # ===========================================================================
  reset-fs
  cd "$TMP"
  mkdir -p lib/browser/aquaman
  touch    lib/browser/aquaman/a.js

  mkdir -p lib/nodejs/superman
  touch    lib/nodejs/superman/a.js

  should-exit 1 'dum_dum_boom_boom duplicate-functions'
  # ===========================================================================


  # ===========================================================================
  reset-fs
  cd "$TMP"
  mkdir -p lib/aquaman/a.js
  mkdir -p lib/superman/b.js
  should-exit 0 'dum_dum_boom_boom duplicate-functions'
  # ===========================================================================

} # === function specs

specs
