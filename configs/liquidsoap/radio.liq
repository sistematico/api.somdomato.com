#!/usr/bin/liquidsoap

%include "config.liq"
%include "requests.node.liq"

node = request.dynamic(pedidos)
live = input.harbor("aovivo", port=8080, password="hackme")
lista = playlist(reload=600, "/opt/liquidsoap/music")
radio = fallback(track_sensitive=false, [live, lista, node])

%include "output.mp3.liq"
