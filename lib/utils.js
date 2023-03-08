import fs from 'fs'
import path from 'path'

export function traverseDir(dir) {
    let paths = []

    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file)
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath)
        } else {
            paths.push(fullPath)
        }
    })

    return paths
}

export function traverseDirAbsolute(dir) {
    let paths = []

    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file)

        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath)
        } else {   
            const realPath = fs.realpathSync(fullPath, (error, resolvedPath) => resolvedPath || error)
            paths.push(realPath)
        }
    })

    return paths
}