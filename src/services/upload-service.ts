import { config } from '../config'
import {
    S3Client,
    PutObjectCommand
} from '@aws-sdk/client-s3'
import {
    getSignedUrl
} from '@aws-sdk/s3-request-presigner'

export class UploadService {

    private S3: S3Client

    constructor () {
        this.S3 = new S3Client({
            region: "auto",
            endpoint: `https://${config.cloudflare.account_id}.r2.cloudflarestorage.com`,
            credentials: config.s3.credentials
        });
    }

    async getPresignedUrl (
        Key: string,
        opts: { expiresIn?: number } = {}
    ) {
        while (Key[0] === '/') {
            Key = Key.slice(1)
        }

        const uploadUrl = await getSignedUrl(this.S3, new PutObjectCommand({
            Bucket: config.s3.bucket,
            Key
        }), { expiresIn: opts.expiresIn || 3600 })

        return Promise.resolve(uploadUrl)
    }

}

export default UploadService