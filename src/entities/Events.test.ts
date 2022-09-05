import { Events } from './Events'
import { event } from '../../jest/setup'

const eventData = { name: "Don't Rock the Boat", description: 'This is a description...', category: 'Hands-On', address: '312 Walnut', startTime: new Date(), endTime: new Date() }

describe('Events', () => {

    it('creates an Event', async () => {
        expect.assertions(2)
        
        const entity = await Events.findById(event._id)
        expect(entity).toBeDefined()

        if (!entity) return
        const found = await Events.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates an Event', async () => {
        expect.assertions(1)

        const entity = await Events.findById(event._id)
        if (!entity) return

        entity.name = 'updated'

        const found = await entity.save()
        expect(found?.name).toBe('updated')
    })

    it('deletes an Event', async () => {
        expect.assertions(2)
        
        const entity = await Events.findById(event._id)
        expect(entity).toBeDefined()

        await Events.deleteOne({ _id: event._id })
        const found = await Events.findById(event._id)
        expect(found).toBeNull()
    })
})
