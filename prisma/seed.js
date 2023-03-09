import { PrismaClient } from '@prisma/client'
import { traverseDirAbsolute } from '../src/utils.js'
// import NodeID3 from 'node-id3'

const prisma = new PrismaClient()

async function main() {
    const songs = traverseDirAbsolute('./songs').map(path => ({ path }))

    let inserts = []
    for (const song of songs) {
        //const tags = NodeID3.read(song.path)
        //update: { title: tags.title, artist: tags.artist, path: song.path },
        //create: { title: tags.title, artist: tags.artist, path: song.path }

        inserts.push(prisma.song.upsert({
            where: { path: song.path },
            update: {},
            create: { path: song.path }
        }))
    }

    await prisma.$transaction(inserts)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
