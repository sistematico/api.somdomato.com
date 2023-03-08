# Som do Mato API

Uma API de músicas usando o Node.js, Prisma e PostgreSQL.

[![Node.js CI](https://github.com/sistematico/api.somdomato.com/actions/workflows/ci.yml/badge.svg)](https://github.com/sistematico/api.somdomato.com/actions/workflows/ci.yml) [![Node.js CD](https://github.com/sistematico/api.somdomato.com/actions/workflows/cd.yml/badge.svg)](https://github.com/sistematico/api.somdomato.com/actions/workflows/cd.yml)

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
