import { IRegistrations, Registrations } from './Registrations'
import { event } from '../../jest/setup'

describe('registrations', () => {

    it('creates a registrations', async () => {
        expect.assertions(2)
        
        const entity = await new Registrations({})
            .save()
        expect(entity).toBeDefined()

        const found = await Registrations.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a registrations', async () => {
        expect.assertions(2)
        
        const entity = await new Registrations({})
            .save()
        expect(entity).toBeDefined()

        await Registrations.updateOne({ _id: entity._id }, { event })
        const found = await Registrations.findById(entity._id)
        expect(found?.event).toEqual(event._id)
    })

    it('deletes a registrations', async () => {
        expect.assertions(2)
        
        const entity = await new Registrations({})
            .save()
        expect(entity).toBeDefined()

        await Registrations.deleteOne({ _id: entity._id })
        const found = await Registrations.findById(entity._id)
        expect(found).toBeNull()
    })
})
