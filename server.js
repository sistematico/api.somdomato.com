import http from 'http'
import { router } from './router/main.js'

const PORT = process.env.PORT || 4000


let server;

server = http.createServer(function(req,res){
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', '*');

    //res.setHeader('Access-Control-Allow-Headers', req.headers.origin)


    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }




    

    router(req, res)
    // setTimeout(function () {
    //     res.writeHead(408, { 'Content-Type': 'application/json' })
    //     res.end(JSON.stringify({ message: 'Tempo limite excedido' }))
    // }, 3000)
})

server.listen(PORT)