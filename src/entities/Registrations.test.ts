import { Registrations, GuestRegistration } from './Registrations'
import { guestRegistration } from '../../jest/setup'

describe('registrations', () => {

    it('creates a registrations', async () => {
        expect.assertions(2)
        
        const entity = await guestRegistration
            .save()
        expect(entity).toBeDefined()

        const found = await Registrations.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a registrations', async () => {
        expect.assertions(2)
        guestRegistration.firstName = 'Billy'
        
        const entity = await guestRegistration
            .save()
        expect(entity).toBeDefined()

        await Registrations.updateOne({ _id: entity._id }, { firstName: guestRegistration.firstName })
        const found = await GuestRegistration.findById(entity._id)
        expect(found?.firstName).toEqual(guestRegistration.firstName)
    })

    it('deletes a registrations', async () => {
        expect.assertions(2)
        
        const entity = await guestRegistration
            .save()
        expect(entity).toBeDefined()

        await Registrations.deleteOne({ _id: entity._id })
        const found = await Registrations.findById(entity._id)
        expect(found).toBeNull()
    })
})
