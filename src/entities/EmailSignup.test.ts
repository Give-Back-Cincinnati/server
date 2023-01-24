import { IEmailSignup, EmailSignup } from './EmailSignup'

describe('EmailSignup', () => {

    it('creates a EmailSignup', async () => {
        expect.assertions(2)
        
        const entity = await new EmailSignup({})
            .save()
        expect(entity).toBeDefined()

        const found = await EmailSignup.findById(entity._id)
        expect(found).toBeDefined()
    })

    it('updates a EmailSignup', async () => {
        expect.assertions(2)
        
        const entity = await new EmailSignup({})
            .save()
        expect(entity).toBeDefined()

        await EmailSignup.updateOne({ _id: entity._id }, { name: 'updated' })
        const found = await EmailSignup.findById(entity._id)
        expect(found?.name).toBe('updated')
    })

    it('deletes a EmailSignup', async () => {
        expect.assertions(2)
        
        const entity = await new EmailSignup({})
            .save()
        expect(entity).toBeDefined()

        await EmailSignup.deleteOne({ _id: entity._id })
        const found = await EmailSignup.findById(entity._id)
        expect(found).toBeNull()
    })
})
