import { PrismaClient } from '@prisma/client'
import { traverseDir } from '../lib/utils.js'
// import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    // const songs = fs.readdirSync('./songs').map(path => ({ path }))
    const songs = traverseDir('./songs').map(path => ({ path }))

    let inserts = []
    for (const data of songs) {
        inserts.push(prisma.song.upsert({
            where: { path: data.path },
            update: { path: data.path },
            create: { path: data.path }
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
