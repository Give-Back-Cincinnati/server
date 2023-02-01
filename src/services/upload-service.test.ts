import { UploadService } from './upload-service'

const Key = 'uploads/this-is-an-image-url.png'

describe('UploadService', () => {
    const service = new UploadService()

    describe('constructor', () => {

        it('returns an instance of UploadService', () => {
            expect(service).toBeInstanceOf(UploadService)
        })

    })

    describe('getPresignedUrl', () => {

        it('returns a string', async () => {
            expect.assertions(2)
            const presignedUrl = await service.getPresignedUrl(Key)

            expect(typeof presignedUrl).toEqual("string")
            expect(presignedUrl).toMatch(new RegExp(`https://gbc-static.undefined.r2.cloudflarestorage.com/${Key}.+`))
        })

        it('removes a preceding `/` if present', async () => {
            expect.assertions(1)
            const presignedUrl = await service.getPresignedUrl(`/${Key}`)

            expect(presignedUrl).toMatch(new RegExp(`https://gbc-static.undefined.r2.cloudflarestorage.com/${Key}.+`))
        })

        it('removes multiple preceding `/` if present', async () => {
            expect.assertions(1)
            const presignedUrl = await service.getPresignedUrl(`////${Key}`)

            expect(presignedUrl).toMatch(new RegExp(`https://gbc-static.undefined.r2.cloudflarestorage.com/${Key}.+`))
        })

    })

})