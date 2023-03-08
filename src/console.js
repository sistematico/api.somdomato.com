import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLastRequest() {
    const lastRequest = await prisma.request.findMany({
        include: { song: true },
        orderBy: { id: 'desc' },
        take: 1
    })

    return lastRequest
}

async function deleteLast() {
    const lastRequest = (await getLastRequest())[0]

    if (typeof lastRequest !== 'undefined' && 'id' in lastRequest) {
        const deleted = await prisma.request.delete({
            where: { id: lastRequest.id },
            include: { song: true }
        })
        return deleted
    }

    return false
}

async function randomSong() {
    const musicas = await prisma.song.count()
    const skip = Math.max(0, Math.floor(Math.random() * musicas) - 1)

    const song = (await prisma.song.findMany({
        take: 1,
        skip: skip,
    }))[0]

    return song
}

let nextSong = await deleteLast()
if (!nextSong) {
    nextSong = await randomSong()
    process.stdout.write(nextSong.path)
} else {
    // if ('song' in nextSong && 'path' in nextSong.song) {
        process.stdout.write(nextSong.song.path)
    // } else {

    // }
}

await prisma.$disconnect()