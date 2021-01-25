import path from 'path'
import crypto from 'crypto'
import multer from 'multer'

const tmpFOlder = path.resolve(__dirname, '..', '..', 'tmp')
export default {
    directory: tmpFOlder,
    storage: multer.diskStorage({
        destination: tmpFOlder,
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(10).toString('hex')
            const fileName = `${fileHash}- ${file.originalname}`

            return callback(null, fileName)
        }
    })
}