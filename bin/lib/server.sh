
# === Starts server for development and testing purposes:
# === {{CMD}}  start
# === Shutdowns down dev/test server.
# === {{CMD}}  stop
server () {

  local PID="tmp/pid.txt"
  case "$1" in

    is_running)
      [[ -f $PID ]]
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
