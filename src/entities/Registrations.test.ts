import { Registrations, GuestRegistration } from './Registrations'
import { guestRegistration } from '../../jest/setup'

describe('registrations', () => {

    it('creates a registrations', async () => {
        expect.assertions(2)
        await Registrations.deleteMany({})
        
        const entity = await new GuestRegistration(guestRegistration)
            .save()
        expect(entity).toBeDefined()

        const found = await Registrations.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a registrations', async () => {
        expect.assertions(1)

        const entity = await GuestRegistration.findById(guestRegistration._id)
        if (!entity) return
        entity.firstName = 'Billy'
        await entity.save()

        const found = await GuestRegistration.findById(entity._id)
        expect(found?.firstName).toEqual(entity.firstName)
    })

    it('deletes a registrations', async () => {
        expect.assertions(1)
        
        const entity = await GuestRegistration.findById(guestRegistration._id)
        if (!entity) return

        await Registrations.deleteOne({ _id: entity._id })
        const found = await Registrations.findById(entity._id)
        expect(found).toBeNull()
    })
})
