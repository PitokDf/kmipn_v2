import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "../configs/env";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: env.googleClientEmail,
        private_key: env.googlePrivateKey
    },
    scopes: ["https://www.googleapis.com/auth/drive"]
})

export const drive = google.drive({ version: "v3", auth })

async function setFilePermissions(fileId: string) {
    try {
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })
    } catch (error) {
        throw error
    }
}

export async function uploadFileToDrive(fileBuffer: Buffer, fileName: string, mimeType: string, folderId: string) {
    try {
        console.info(`uploading file '${fileName}' to drive`);

        const fileMetadata = {
            name: fileName,
            parents: [folderId]
        }

        const bufferStream = new Readable()
        bufferStream.push(fileBuffer)
        bufferStream.push(null)

        const media = {
            mimeType,
            body: bufferStream
        }

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id, webViewLink, webContentLink'
        })

        await setFilePermissions(response.data.id!)
        console.info(`successfully upload file '${fileName}' to drive`);
        console.log(response.data.id);

        return response.data
    } catch (error) {
        console.info(`uploading file '${fileName}' to drive, failed`);
        console.log(error);

        throw error
    }
}

export async function deleteFileFromDrive(fileId: string) {
    try {
        await drive.files.delete({ fileId })
    } catch (error) {
        throw error
    }
}

export async function createDriveFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
        const fileMetaData: any = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
        }

        if (parentFolderId) {
            fileMetaData.parents = [parentFolderId];
        }

        const response = await drive.files.create({
            requestBody: fileMetaData,
            fields: 'id'
        })

        return response.data.id!
    } catch (error) {
        console.log(`Gagal membuat folder '${folderName}' di DRIVE`)
        throw error
    }
}