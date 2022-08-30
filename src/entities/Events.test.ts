import { Events } from './Events'

const eventData = { name: "Don't Rock the Boat", description: 'This is a description...', category: 'Hands-On', address: '312 Walnut', startTime: new Date(), endTime: new Date() }

describe('Events', () => {

    it('creates an Event', async () => {
        expect.assertions(2)
        
        const entity = await new Events(eventData)
            .save()
        expect(entity).toBeDefined()

        const found = await Events.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates an Event', async () => {
        expect.assertions(2)
        
        const entity = await new Events(eventData)
            .save()
        expect(entity).toBeDefined()

        await Events.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await Events.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes an Event', async () => {
        expect.assertions(2)
        
        const entity = await new Events(eventData)
            .save()
        expect(entity).toBeDefined()

        await Events.deleteOne({ _id: entity._id })
        const found = await Events.findById(entity._id)
        expect(found).toBeNull()
    })
})
