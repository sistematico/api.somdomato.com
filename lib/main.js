import { PrismaClient } from '@prisma/client'
import { traverseDir } from './utils.js'

const prisma = new PrismaClient()

export async function update() {
    // const songs = fs.readdirSync('../songs').map(path => ({ path }))
    const songs = traverseDir('../songs').map(path => ({ path }))

    let inserts = []
    for (const data of songs) {
        inserts.push(prisma.song.upsert({
            where: { path: data.path },
            update: {},
            create: { path: data.path }
        }))
    }

    await prisma.$transaction(inserts)
    await prisma.$disconnect()
}

// update()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })

export async function list() {
    const songs = await prisma.song.findMany()
    await prisma.$disconnect()
    return songs
}
