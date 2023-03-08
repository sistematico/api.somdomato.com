import http from 'http'
import { router } from './router/main.js'

const PORT = process.env.PORT || 4000
http.createServer(function (req, res) {
    router(req,res)
    setTimeout(function () {
        res.writeHead(408, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Tempo limite excedido'}))
    }, 3000)
}).listen(PORT)