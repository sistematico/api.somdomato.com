import { PrismaClient } from '@prisma/client'
import { traverseDir } from './utils.js'

const prisma = new PrismaClient()

async function getLastRequest() {
    return await prisma.request.findMany({
        orderBy: { id: 'desc' },
        take: 1
    }) ?? false
}

export async function randomSong() {
    return prisma.song.findMany({
        orderBy: raw`random()`,
        take: 1
    })
}

export async function deleteLast() {
    const lastRequest = await prisma.request.findMany({
        orderBy: { id: 'desc' },
        take: 1
    })

    if (typeof lastRequest === 'array') {
        await prisma.request.delete({
            where: {
                id: lastRequest[0].id,
            },
        })
    }

    await prisma.$disconnect()
    return lastRequest
}

export async function update() {
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

export async function list() {
    const songs = await prisma.song.findMany()
    await prisma.$disconnect()
    return songs
}

export async function addRequest(id) {
    // const query = await prisma.song.findFirst({
    //     where: { id: id }
    // })

    const insertRequest = prisma.request.upsert({
        where: { id: id },
        update: {},
        create: { songId: id }
    })

    await prisma.$disconnect()
    return insertRequest ?? false
}

export async function search(param) {
    const result = await prisma.song.findMany({
        where: {
            OR: [
                { artist: { contains: param, mode: 'insensitive' } },
                { title: { contains: param, mode: 'insensitive' } },
            ],
        }
    })

    await prisma.$disconnect()
    return result
}

export async function pickSong() {
    const requested = getLastRequest()

    if (!requested) {
        return await randomSong()
    }

    return await requested
}