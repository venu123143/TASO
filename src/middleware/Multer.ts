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

const multerStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../src/public/images');
        await createIfNoExist(uploadDir)
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const randomNum = Math.round(Math.random() * 1E9);
        const uniqueSufix = Date.now() + randomNum
        const fileExtension = path.extname(file.originalname);
        const fileNameWithoutExtension = path.basename(file.originalname, fileExtension);
        const fileName = fileNameWithoutExtension.replace(/ /g, '_');
        cb(null, fileName + "_" + uniqueSufix + fileExtension)
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

export const multerMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        // Multer error occurred
        if (err.code === 'LIMIT_FILE_SIZE') {
            // RESPONSE.FailureResponse(res, 400, { message: })
            throw new Error('File/Files exceed 12 MB limit. Please reduce file size and retry.')
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            // RESPONSE.FailureResponse(res, 400, { message: })
            throw new Error('The maximum number of files allowed is 10.')
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            // RESPONSE.FailureResponse(res, 400, { message: })
            throw new Error('The maximum number of files allowed is 10.')
        }
        // Handle other Multer errors
        RESPONSE.FailureResponse(res, 400, { message: err.message })
        return
    }
    next()
}
export const uploadImage = multer({
    storage: multerStorage,
    // fileFilter: multerFilter,
    limits: { fieldSize: 12 * 1000 * 1000, fileSize: 12 * 1000 * 1000 }
})