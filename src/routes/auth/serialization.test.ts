import mongoose from 'mongoose'
import { Serialization, SerializedUser } from './serialization'
import { User, IUser } from "../../entities/Users"
import {Permissions} from "../../entities/Permissions"
import {Roles} from "../../entities/Roles"

declare global {
    var __MONGO_URI__: string
}

describe('Serialization', () => {
    const cb = jest.fn()
    const perm = new Permissions({ name: 'permissions.get', group: 'permissions' })
    const role = new Roles({ name: 'User', permissions: [perm] })
    let user = new User({
        firstName: 'hello',
        lastName: 'world',
        email: 'hello@world.com',
        role
    })
    let connection: any
    beforeAll(async () => {
        connection = await mongoose.connect(global.__MONGO_URI__ as string)
        await perm.save()
        await role.save()
        await user.save()
    });

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await perm.delete()
        await role.delete()
        await user.delete()
        await connection.disconnect()
    })

    describe('serialize', () => {

        it('calls the callback', () => {
            expect.assertions(1)


            Serialization.serialize(user, cb)
            expect(cb).toHaveBeenCalled()
        })

        it('returns an objectId', () => {
            expect.assertions(2)

            Serialization.serialize(user, cb)
            expect(cb.mock.calls[0][1]).toBeInstanceOf(mongoose.Types.ObjectId)
            expect(cb.mock.calls[0][1]).toEqual(user._id)
        })

    })

    describe('deserialize', () => {

        it('calls the callback', async () => {
            expect.assertions(1)

            await Serialization.deserialize(user._id, cb)
            expect(cb).toHaveBeenCalled()
        })

        it('returns the user', async () => {
            expect.assertions(2)

            await Serialization.deserialize(user._id, cb)
            expect(cb).toHaveBeenCalledWith(null, expect.any(User))
            expect(cb.mock.calls[0][1]._id).toEqual(user._id)
        })

        it('returns the user with permissions', async () => {
            expect.assertions(4)

            await Serialization.deserialize(user._id, cb)
            const foundUser = cb.mock.calls[0][1] as SerializedUser
            expect(foundUser._id).toEqual(user._id)
            expect(foundUser.role).toHaveProperty('permissions')
            if (foundUser.role && 'permissions' in foundUser.role) {
                expect(foundUser.role.permissions).toHaveLength(1)
                expect(foundUser.role.permissions[0]).toEqual(expect.any(Permissions))
            }
        })

        it('returns the user with hashPermissions', async () => {
            expect.assertions(2)

            await Serialization.deserialize(user._id, cb)
            const foundUser = cb.mock.calls[0][1] as SerializedUser
            expect(foundUser).toHaveProperty('hashPermissions')
            expect(foundUser.hashPermissions[perm.name]).toEqual(perm.name)
        })

        it('returns an error if no user found', async () => {
            expect.assertions(1)

            await Serialization.deserialize(new mongoose.Types.ObjectId(), cb)

            expect(cb.mock.calls[0][0].message).toEqual('No user found')
        })

    })
})

