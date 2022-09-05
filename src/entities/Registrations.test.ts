import { Registrations, GuestRegistration } from './Registrations'
import { guestRegistration } from '../../jest/setup'

describe('registrations', () => {

    it('creates a registrations', async () => {
        expect.assertions(1)

        const found = await Registrations.findById(guestRegistration._id)
        expect(found).toBeDefined()
    })

    it('updates a registrations', async () => {
        expect.assertions(1)
        const tmpGuestRegistration = await GuestRegistration.findById(guestRegistration._id)
        if (!tmpGuestRegistration)return;

        tmpGuestRegistration.firstName = 'Billy'
        await tmpGuestRegistration.save()

        await Registrations.updateOne({ _id: guestRegistration._id }, { firstName: tmpGuestRegistration.firstName })
        const found = await GuestRegistration.findById(guestRegistration._id)
        expect(found?.firstName).toEqual(tmpGuestRegistration.firstName)
    })

    it('deletes a registrations', async () => {
        expect.assertions(1)


        await Registrations.deleteOne({ _id: guestRegistration._id })
        const found = await Registrations.findById(guestRegistration._id)
        expect(found).toBeNull()
    })
})
