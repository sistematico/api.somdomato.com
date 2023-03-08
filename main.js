import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const prisma = new PrismaClient()

async function main() {
    const songs = fs.readdirSync(`${__dirname}/songs`).map(path => ({ path }))

    let inserts = []
    for (const data of songs) {
        inserts.push(prisma.song.upsert({
            where: { path: data.path },
            update: {},
            create: { path: data.path }
        }))

        // prisma.song.upsert({
        //     where: {
        //         path: data.path,
        //     },
        //     update: {},
        //     create: {
        //         path: data.path,
        //     },
        // })
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
