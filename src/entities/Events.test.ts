import { Events } from './Events'
import { event } from '../../jest/setup'
import mongoose from 'mongoose'

describe('Events', () => {

    it('creates an Event', async () => {
        expect.assertions(2)
        
        const entity = await Events.findById(event._id)
        expect(entity).toBeDefined()

        if (!entity) return
        const found = await Events.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('saves a slug when created', async () => {
        expect.assertions(2)

        const entity = await Events.findById(event._id)
        expect(entity).toBeDefined()
        if(!entity) return

        expect(entity.slug).toEqual(encodeURIComponent(entity.name.toLowerCase().replace(/\s/g, '-') + '-' + new Date().getFullYear().toString() ))
    })

    it('does not save slug when updated', async () => {
        expect.assertions(2)

        const entity = await Events.findById(event._id)
        expect(entity).toBeDefined()
        if(!entity) return

        let originalName = entity.name
        entity.name = 'hello world'
        await entity.save()
        expect(entity.slug).toEqual(encodeURIComponent(originalName.toLowerCase().replace(/\s/g, '-') + '-' + new Date().getFullYear().toString() ))
    })

    it('generates a new slug if a slug is already taken', async () => {
        expect.assertions(1)

        await Promise.all([
            await new Events({...event, _id: new mongoose.Types.ObjectId()}).save(),
            await new Events({...event, _id: new mongoose.Types.ObjectId()}).save(),
            await new Events({...event, _id: new mongoose.Types.ObjectId()}).save(),
            await new Events({...event, _id: new mongoose.Types.ObjectId()}).save(),
        ])
        const entity = await new Events({...event, _id: new mongoose.Types.ObjectId()}).save()

        const originalSlug = entity.slug

        expect(entity.slug.startsWith(originalSlug)).toEqual(true)
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
