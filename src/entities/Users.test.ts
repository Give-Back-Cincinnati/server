import { Users } from './Users'
import { Permissions } from './Permissions'
import { role, user, password } from '../../jest/setup'

describe('User', () => {

    it('creates a User', async () => {
        expect.assertions(2)

        const found = await Users.findById(user._id)
        expect(found).toBeDefined()
        expect(found).toHaveProperty('role', role._id)
    })

    it('saves an email as lowercase', async () => {
        expect.assertions(1)

        let tmpUser = await Users.findById(user._id)
        if (!tmpUser)return;

        tmpUser.email = 'CLARK@notsuperman.com'

        const entity = await tmpUser.save()

        expect(entity).toHaveProperty('email', tmpUser.email.toLowerCase())
    })

    it('saves the password as a hashed value', async () => {
        expect.assertions(1)
        let tmpUser = await Users.findById(user._id)
        if (!tmpUser)return;

        const password = 'password'
        tmpUser.password = 'password1'
        await tmpUser.save()

        const found = await Users.findById(tmpUser._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))
    })

    it('saves the updated password as a hashed value', async () => {
        expect.assertions(2)
        const password = 'password'
        let tmpUser = await Users.findById(user._id)
        if (!tmpUser)return;

        await tmpUser.save()
        const found = await Users.findById(tmpUser._id)
        expect(found).toHaveProperty('password', expect.not.stringContaining(password))

        tmpUser.password = 'password2'
        await tmpUser.save()

        const found2 = await Users.findById(tmpUser._id)
        expect(found2).toHaveProperty('password', expect.not.stringContaining(found?.password || ''))
    })

    it('updates a User', async () => {
        expect.assertions(2)
        let tmpUser = await Users.findById(user._id)
        if (!tmpUser)return;

        const entity = await tmpUser.save()
        expect(entity).toBeDefined()

        await Users.updateOne({ _id: entity._id }, { firstName: 'updated' })
        const found = await Users.findById(entity._id)
        expect(found?.firstName).toBe('updated')
    })

    it('deletes a User', async () => {
        expect.assertions(2)

        const entity = await new Users({ firstName: 'Lois', lastName: 'Lane', email: 'Lois@dailyplanet.com' })
            .save()
        expect(entity).toBeDefined()

        await Users.deleteOne({ _id: entity._id })
        const found = await Users.findById(entity._id)
        expect(found).toBeNull()
    })

    describe('findByIdWithPermissions', () => {

        it('has permissions in the database', async () => {
            expect.assertions(4)
            const result = await Users.findByIdWithPermissionsAndFilters(user._id)

            expect(result).toHaveProperty('role')
            expect(result.role).toHaveProperty('permissions')
            if (result.role && 'permissions' in result.role) {
                expect(result.role.permissions).toHaveLength(1)
                expect(result.role.permissions[0]).toEqual(expect.any(Permissions))
            }
        })
    })

    describe('comparePassword', () => {

        it('returns User if the passwords match', async () => {
            let tmpUser = await Users.findById(user._id)
            if (!tmpUser)return;

            tmpUser.password = password
            await tmpUser.save()

            const result = await Users.authenticate(tmpUser.email, password)
            expect(result).toEqual(expect.any(Users))
            expect(result).toHaveProperty('_id', tmpUser._id)
            expect(result).toHaveProperty('password', '')
        })

        it('returns false if the passwords don\'t match', async () => {
            const result = await Users.authenticate(user.email, 'password1')
            expect(result).toEqual(false)
        })

        it('returns false if there is no user with that email', async () => {
            const result = await Users.authenticate('email1', password)
            expect(result).toEqual(false)
        })

    })
})
