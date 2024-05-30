
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"
import fs from "fs"

// const accountName = process.env.AZURE_ACCOUNT_NAME as string
const containerName = process.env.AZURE_CONTAINER_NAME as string
// const sasToken = process.env.AZURE_SAS_TOKEN as string


// const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`)
// const containerClient = blobServiceClient.getContainerClient(containerName)

const blobServiceClient: BlobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING as string);
const containerClient = blobServiceClient.getContainerClient(containerName)

export async function saveFileToBlob(fileName: string, filePath: string): Promise<string> {
    try {

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const readStream = fs.createReadStream(filePath);
        await blockBlobClient.uploadStream(readStream);
        return blockBlobClient.url;

    } catch (error: any) {
        console.log("upload to aure", error);

        return 'unable to upload files';
    }
}

export async function deleteFileFromBlob(fileName: string): Promise<string> {
    try {
        const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
        console.log(`File "${fileName}" deleted from Azure Blob Storage.`);
        return 'File deleted successfully'
    } catch (error: any) {
        console.error(`Error deleting file "${fileName}" from Azure Blob Storage:`, error);
        return 'unable to delete files';
    }
}
