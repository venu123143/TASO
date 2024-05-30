import { Request, Response } from "express"
import path from "path"
import fs from "fs"
import { saveFileToBlob } from "../../utils/uploadToAzure"


const checkAllChunksUploaded = async (totalChunks: number, originalName: string) => {
    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join('uploads', `${originalName}.part-${i}`);
        if (!fs.existsSync(chunkPath)) {
            return false;
        }
    }
    return true;
};

const mergeChunks = async (totalChunks: number, originalName: string, finalPath: string) => {
    const writeStream = fs.createWriteStream(finalPath);
    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join('uploads', `${originalName}.part-${i}`);
        const chunkData = await fs.promises.readFile(chunkPath);
        writeStream.write(chunkData);
    }
    writeStream.end();
};

const uploadPost = async (req: Request, res: Response) => {
    const { chunkIndex, totalChunks, originalName, fileType } = req.body;
    const chunkPath = path.join('uploads', `${originalName}.part-${chunkIndex}`);
    const finalPath = path.join('uploads', originalName);
    try {
        // Move the uploaded chunk to a specific location
        await fs.promises.rename(req?.file?.path as string, chunkPath);

        // Check if all chunks have been uploaded
        const allChunksUploaded = await checkAllChunksUploaded(totalChunks, originalName);
        if (allChunksUploaded) {
            // Merge all chunks into a single file
            await mergeChunks(totalChunks, originalName, finalPath);

            const azureFileUrl = await saveFileToBlob(originalName, finalPath);
            console.log(`File uploaded to Azure Blob Storage: ${azureFileUrl}`);
            // Optionally, you can delete the temporary chunk files
            for (let i = 0; i < totalChunks; i++) {
                const chunkFilePath = path.join('uploads', `${originalName}.part-${i}`);
                await fs.promises.unlink(chunkFilePath);
            }
            await fs.promises.unlink(finalPath);
            res.status(201).json({ message: 'File uploaded successfully', azureFileUrl });
        } else {
            res.status(200).json({ message: 'Chunk uploaded successfully' });
        }
    } catch (error) {
        console.error('Error uploading chunk:', error);
        res.status(500).json({ error: 'An error occurred while uploading the chunk' });
    }
}

export default {
    uploadPost
}