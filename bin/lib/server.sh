
# === Starts server for development and testing purposes:
# === {{CMD}}  start
# === Shutdowns down dev/test server.
# === {{CMD}}  stop
server () {

  case "$1" in

    start)
      server stop
      (node www/server.js) &
      server_pid="$!"

      mkdir -p tmp
      echo "$server_pid" > tmp/pid.txt
      echo "=== Started server: $server_pid - $$"
      sleep 0.5
      ;;

    stop)
      if [[ -f "tmp/pid.txt"  ]]; then
        pid="$(cat tmp/pid.txt)"
        if [[ -n "$pid" ]]; then
          if kill -0 "$pid" 2>/dev/null; then
            echo "=== Shutting server down: pid: $pid - \$\$: $$ ..."
            kill -SIGINT "$pid"
          fi
        fi
        rm tmp/pid.txt || :
      fi
      ;;

    *)
      echo "!!! Unknown server action: $@"
      exit 1

  esac
}
