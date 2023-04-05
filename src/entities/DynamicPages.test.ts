import { IDynamicPages, DynamicPages } from './DynamicPages'

describe('DynamicPages', () => {

    it('creates a DynamicPages', async () => {
        expect.assertions(2)
        
        const entity = await new DynamicPages({})
            .save()
        expect(entity).toBeDefined()

        const found = await DynamicPages.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a DynamicPages', async () => {
        expect.assertions(2)
        
        const entity = await new DynamicPages({})
            .save()
        expect(entity).toBeDefined()

        await DynamicPages.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await DynamicPages.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a DynamicPages', async () => {
        expect.assertions(2)
        
        const entity = await new DynamicPages({})
            .save()
        expect(entity).toBeDefined()

        await DynamicPages.deleteOne({ _id: entity._id })
        const found = await DynamicPages.findById(entity._id)
        expect(found).toBeNull()
    })
})
