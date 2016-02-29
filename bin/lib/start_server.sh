
# === Starts server for development and testing purposes:
# === {{CMD}}
start_server () {
    shutdown_server
    (node main/server.js) &
    server_pid="$!"

    mkdir -p tmp
    echo "$server_pid" > tmp/pid.txt
    echo "=== Started server: $server_pid - $$"
}
