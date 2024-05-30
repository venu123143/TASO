import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs'
import path from "path"
import RESPONSE from '../utils/Response';

const createIfNoExist = (path: string) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('resolve');
                }
            });
        } else {
            resolve('resolve');
        }
    });
};

export const multerMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.log(err);

        if (err.code === 'LIMIT_FILE_SIZE') {
            throw new Error('File/Files exceed 12 MB limit. Please reduce file size and retry.')
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            throw new Error('The maximum number of files allowed is 3.')
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            throw new Error('The maximum number of files allowed is 3.')
        }
        // Handle other Multer errors
        RESPONSE.FailureResponse(res, 400, { message: err.message })
        return
    }
    next()
}
const uploadDir = path.join(__dirname, '../../src/public/images');

const multerStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        await createIfNoExist(uploadDir)
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const { chunkIndex, originalName } = req.body;
        console.log(originalName, chunkIndex);

        const chunkFilename = `${originalName}.part-${chunkIndex}`;
        cb(null, chunkFilename);
        // const uniqueSufix = Date.now() + Math.round(Math.random() * 1E9);
        // const fileExtension = path.extname(file.originalname);
        // const basename = path.basename(file.originalname, fileExtension).replace(/ /g, '_')
        // cb(null, basename + "_" + uniqueSufix + fileExtension)
    }
})


// const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     console.log(file.mimetype);
//     if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Unsupported file format"));
//     }
// };


export const uploadImage = multer({
    storage: multerStorage,
    // fileFilter: multerFilter,
    limits: { fieldSize: 12 * 1000 * 1000, fileSize: 12 * 1000 * 1000 }
})