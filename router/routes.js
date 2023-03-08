import url from 'url'
import { list } from '../lib/main.js'

export const routes = {
    async handleRequest(request, response) {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        let path = url.parse(request.url).pathname;

        switch (path) {
            case '/list':
                const songs = await list()
                response.write(JSON.stringify(songs))
                response.end()
                break
            case '/about':
                console.log('About')
                break
            default:
                response.writeHead(404)
                response.write(JSON.stringify({ message: 'Route not found' }))
                response.end()
        }
    }
}