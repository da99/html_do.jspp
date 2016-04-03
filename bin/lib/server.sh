
# === Starts server for development and testing purposes:
# === {{CMD}}  start
# === Shutdowns down dev/test server.
# === {{CMD}}  stop
server () {
  local +x PID="tmp/pid.txt"
  mkdir -p tmp

  case "$1" in

    is-running)
      [[ -f $PID ]]
      ;;

    port)
      if ! server is-running ; then
        mksh_setup RED "!!! Server is {{not running}}."
        exit 1
      fi

      netstat -tulpn 2>/dev/null | grep "$(cat $PID)/node" | grep -Po ':::\K(\d+)'
      ;;

    index)
      echo "http://localhost:$(server port)/$(find "$THIS_DIR/www/" -mindepth 1 -maxdepth 1 -type f -name "specs*html" | xargs -I FILE basename FILE)"
      ;;

    start)
      server stop
      (node www/server.js) &
      server_pid="$!"

      mkdir -p tmp
      echo "$server_pid" > "$PID"
      echo "=== Started server: $server_pid - $$"
      sleep 0.5
      ;;

    stop)
      if [[ -e "$PID"  ]]; then
        num="$(cat $PID)"
        if [[ -n "$num" ]] && kill -0 "$num" 2>/dev/null; then
          echo "=== Shutting server down: pid: $num..."
          kill -SIGINT "$num"
        fi
        rm -f "$PID"
      fi
      ;;

    *)
      echo "!!! Unknown server action: $@"
      exit 1

  esac
}
