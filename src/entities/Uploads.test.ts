import { IUploads, Uploads } from './Uploads'

describe('Uploads', () => {

    it('creates a Uploads', async () => {
        expect.assertions(2)
        
        const entity = await new Uploads({})
            .save()
        expect(entity).toBeDefined()

        const found = await Uploads.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a Uploads', async () => {
        expect.assertions(2)
        
        const entity = await new Uploads({})
            .save()
        expect(entity).toBeDefined()

        await Uploads.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Uploads.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a Uploads', async () => {
        expect.assertions(2)
        
        const entity = await new Uploads({})
            .save()
        expect(entity).toBeDefined()

        await Uploads.deleteOne({ _id: entity._id })
        const found = await Uploads.findById(entity._id)
        expect(found).toBeNull()
    })
})
