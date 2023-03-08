# Logs
set("log.file.path", "/dev/null")
set("log.stdout", true)

set("server.telnet", false)
set("harbor.bind_addrs", ["0.0.0.0"])

# tweak these values if you have lag, skipping, buffer underrun etc
set("frame.duration",0.04)
set("root.max_latency",60.)

set("request.grace_time", 3.0)
