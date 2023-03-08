// import { list, addRequest } from '../model/song.js'
import { list, addRequest, deleteLast } from '../src/main.js'

export const router = async (request, response) => {
    const notFound = (message = 'Route not found') => {
        response.writeHead(404)
        response.write(JSON.stringify({ message }))
        response.end()
    }

    if (request.method === 'GET') {
        if (request.url === '/musicas') {
            const songs = await list()
            response.writeHead(200, { 'Content-Type': 'application/json' })
            // response.write(JSON.stringify(songs))
            response.end(JSON.stringify(songs))
        } else if (request.url.match(/\/musica\/([0-9]+)/)) { //  GET: /musica/:id
            try {
                const id = request.url.split("/")[3] // extract id from url
                const song = await getSong(id) // get blog from DB

                if (song) {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(song))
                } else {
                    throw new Error("Requested blog does not exist")
                }
            } catch (error) {
                response.writeHead(404, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: error }))
            }
        } else {
            notFound()
        }
    } else if (request.method === 'POST') {
        if (request.url === '/request') {
            try {
                let body = ''
                request.on('data', chunk => { body += chunk.toString() })

                request.on('end', async () => {
                    let id = Number(JSON.parse(body).id)
                    let songRequest = await addRequest(id)
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    let result = JSON.stringify(songRequest)

                    if (songRequest)
                        response.end(JSON.stringify({ 'message': `ID: ${id} pedido com sucesso: ${result}` }))
                    else
                        response.end(JSON.stringify({ 'message': `A música com o ID: ${id} não existe.` }))
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            notFound()
        }
    } else if (request.method === 'PUT') { //PUT: /api/blogs/:id
        if (request.url.match(/\/api\/blogs\/([0-9]+)/)) { //PUT: /api/blogs/:id
            try {
                // extract id from url
                const id = request.url.split("/")[3];

                let body = '';

                //listen for data event
                request.on('data', (chunk) => {
                    body += chunk.toString()
                })

                request.on("end", async () => {
                    let updatedBlog = await Blog.findByIdAndUpdate(id, JSON.parse(body), {
                        new: true,
                    });

                    // set the status code and content-type
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    //send response
                    response.end(JSON.stringify(updatedBlog));
                });
            } catch (error) {
                console.log(error)
            }
        } else {
            notFound()
        }
    } else if (request.method === 'DELETE') {
        if (request.url.match(/\/request\/([0-9]+)/)) {
            try {
                const id = Number(request.url.split("/")[3])
                const deleted = await deleteLast(id)
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: `Request deleted sucessfully: ${JSON.stringify(deleted)}` }))
            } catch (error) {
                response.writeHead(404, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: error }))
            }
        } else {
            notFound()
        }
    } else {
        notFound()
    }
}