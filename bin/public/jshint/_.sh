
jshint () {
    # === __ jshint
    TEMP_FILE=$TEMP/fail_jshint
    FAIL="$(cat $TEMP_FILE 2>/dev/null || :)"
    JS_FILE='^.*\.js$'
    CHANGE="$(cat $TEMP/CHANGE 2>/dev/null || :)"

    if [[ -z "$@" ]]; then
      group='*'
    else
      group="$1"; shift
    fi

    reset_fail () {
      FAIL=""; echo "" > $TEMP_FILE
    }

    if [[ -n "$FAIL" && ! -s "$FAIL" ]]; then # file has moved or deleted
      reset_fail
    fi

    if [[ -n "$CHANGE" && "$CHANGE" =~ $JS_FILE  ]]; then
      js_setup jshint "$CHANGE"
    fi

    if [[ -n "$FAIL" && "$FAIL" =~ $JS_FILE ]]; then
      js_setup jshint "$FAIL" && { reset_fail; } || :
    fi

    files="$(echo lib/$group/*.js)"
    echo -n "=== Linting $(echo $files | wc -w) files: "
    jshint $files

    reset_fail
    echo -e "${Green}pass${Color_Off} ==="
} # === end function
