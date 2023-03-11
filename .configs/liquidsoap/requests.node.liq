def pedidos() =
    uri = list.hd(default="", get_process_lines('sudo -u nginx /usr/bin/node /var/www/api.somdomato.com/src/console.js', timeout=10.))
    request.create(uri)
end