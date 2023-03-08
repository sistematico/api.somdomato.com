# Som do Mato API

Uma API de músicas usando o Node.js, Prisma e PostgreSQL.

[![Node.js CI](https://github.com/sistematico/api.somdomato.com/actions/workflows/ci.yml/badge.svg)](https://github.com/sistematico/api.somdomato.com/actions/workflows/ci.yml) [![Node.js CD](https://github.com/sistematico/api.somdomato.com/actions/workflows/cd.yml/badge.svg)](https://github.com/sistematico/api.somdomato.com/actions/workflows/cd.yml)

## System users

```
icecast:x:989:985:icecast streaming server:/home/icecast:/bin/bash
liquidsoap:x:988:983:Liquidsoap system user account:/home/liquidsoap:/bin/bash
```

## Nginx

```
location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Systemd

### /etc/systemd/system/sdm-watcher.path

```
[Path]
PathModified=/var/www/api.somdomato.com

[Install]
WantedBy=multi-user.target
```

### /etc/systemd/system/sdm-watcher.service

```
[Unit]
Description=Som do Mato API Server Watcher

[Service]
Type=oneshot
ExecStart=/usr/bin/systemctl restart sdm

[Install]
WantedBy=multi-user.target
```

### /etc/systemd/system/sdm.service

```
[Unit]
Description=Som do Mato API Service

[Service]
Environment=NODE_ENV=production PORT=4000
User=nginx

ExecStart=/usr/bin/node /var/www/api.somdomato.com/server.js
WorkingDirectory=/var/www/api.somdomato.com

RestartSec=10
Restart=always

#StandardOutput=/var/www/api.somdomato.com/logs/sdm.out.log
#StandardError=/var/www/api.somdomato.com/logs/sdm.err.log
#SyslogIdentifier=nodejs-sdm

[Install]
WantedBy=multi-user.target
```

## LiquidSoap

### /etc/liquidsoap/radio.liq

```
#!/usr/bin/liquidsoap

%include "config.liq"
%include "requests.node.liq"

node = request.dynamic(pedidos)
live = input.harbor("aovivo", port = 8080, password = "hackme")
lista = playlist(reload=600, "/opt/liquidsoap/music")
radio = fallback(track_sensitive=false, [live, lista, node])

%include "output.mp3.liq"
```

### /etc/liquidsoap/config.liq

``` 
# Logs
set("log.file.path", "/dev/null")
set("log.stdout", true)

set("server.telnet", false)
set("harbor.bind_addrs", ["0.0.0.0"])

# tweak these values if you have lag, skipping, buffer underrun etc
set("frame.duration",0.04)
set("root.max_latency",60.)

set("request.grace_time", 3.0)
``` 

### /etc/liquidsoap/requests.node.liq

``` 
def pedidos() =
    uri = list.hd(default="", get_process_lines('sudo -u nginx /usr/bin/node /var/www/api.somdomato.com/src/console.js', timeout=10.))
    request.create(uri)
end
``` 

### /etc/liquidsoap/output.mp3.liq

``` 
output.icecast(%mp3
  (bitrate=128, samplerate=44100, id3v2=true),
  host = "localhost",
  port = 8000,
  password = "hackme",
  mount = "/",
  name = "Radio Som do Mato",
  description = "A mais sertaneja!",
  genre = "Sertanejo",
  icy_metadata="true",
  mksafe(radio))
``` 