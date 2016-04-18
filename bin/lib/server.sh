
# === Starts server for development and testing purposes:
# === {{CMD}}  start
# === Shutdowns down dev/test server.
# === {{CMD}}  quit
server () {
  local +x PID="tmp/pid.txt"
  mkdir -p tmp

  case "$1" in

    is-running)
      [[ -f $PID ]] && kill -0 "$(cat  $PID)" 2>/dev/null
      ;;

    port)
      if ! server is-running ; then
        mksh_setup RED "!!! Server is {{not running}}."
        exit 1
      fi

      netstat -tulpn 2>/dev/null | grep "$(cat $PID)/node" | grep -Po ':::\K(\d+)'
      ;;

    index)
      echo "http://localhost:$(server port)/$(find "$THIS_DIR/lib/browser/specs/" -mindepth 1 -maxdepth 1 -type f -name "specs*html" | xargs -I FILE basename FILE)"
      ;;

    restart)
      $0 server quit
      $0 server start
      ;;

    start)
      if $0 server is-running ; then
        mksh_setup BOLD "=== Server {{already}} running."
        return 0
      fi

      (node lib/browser/specs/server.js) &
      server_pid="$!"

      mkdir -p tmp
      echo "$server_pid" > "$PID"
      sleep 0.5
      mksh_setup max-wait 3s  "$0 server is-running"
      echo "=== Started server: $server_pid - $$"
      ;;

    quit)
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
