import { Events } from './Events'

describe('Events', () => {

    it('creates a Events', async () => {
        expect.assertions(2)
        
        const entity = await new Events({})
            .save()
        expect(entity).toBeDefined()

        const found = await Events.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a Events', async () => {
        expect.assertions(2)
        
        const entity = await new Events({})
            .save()
        expect(entity).toBeDefined()

        await Events.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Events.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a Events', async () => {
        expect.assertions(2)
        
        const entity = await new Events({})
            .save()
        expect(entity).toBeDefined()

        await Events.deleteOne({ _id: entity._id })
        const found = await Events.findById(entity._id)
        expect(found).toBeNull()
    })
})
