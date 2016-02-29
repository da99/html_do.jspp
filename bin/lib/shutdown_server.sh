
# === Shutdowns down dev/test server.
# === {{CMD}}
shutdown_server () {
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
}
