import { Request, Response } from 'express'
import userHasPermissions from './userHasPermissions'
import { Users } from "../../../entities/Users"
import { Permissions } from "../../../entities/Permissions"
import { Roles } from '../../../entities/Roles'
import { Serialization } from "../serialization"
import { user, superadmin, role } from '../../../../jest/setup'

const nextMock = jest.fn()
const isAuthenticated = jest.fn()
    .mockImplementation(() => false)

const req: Partial<Request> = {
    baseUrl: '/users',
    route: {
        path: '/me'
    },
    method: 'get',
    user,
    isAuthenticated
}
const res: Partial<Response> = {
    sendStatus: jest.fn()
}

describe('userHasPermissions', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns a function', () => {
        const result = userHasPermissions()
        expect(typeof result).toBe('function')
    })

    it('sends a 401 if unauthenticated', () => {
        userHasPermissions()(req as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('sends 401 if user has no permissions', () => {
        isAuthenticated.mockImplementationOnce(() => true)
        userHasPermissions()({...req, user: new Users({})} as Request, res as Response, nextMock)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('calls next if user has permissions', async () => {
        expect.assertions(1)
        isAuthenticated.mockImplementationOnce(() => true)
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            userHasPermissions()({...req, user: serializedUser } as Request, res as Response, nextMock)
            expect(nextMock).toHaveBeenCalled()
        })
    })

    it('path is removed if empty', async () => {
        expect.assertions(1)

        const tmpRole = await Roles.findById(role._id)
        if (!tmpRole)return;

        // add this permission to the user's role
        const userGetPerm = await new Permissions({ name: 'users.get' }).save()
        tmpRole.permissions = [...role.permissions, userGetPerm]
        await tmpRole.save()

        isAuthenticated.mockImplementationOnce(() => true)
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            userHasPermissions()({...req, route: { path: '/' }, user: serializedUser } as Request, res as Response, nextMock)
            expect(nextMock).toHaveBeenCalled()
        })
    })

    it('calls next with complex path', async () => {
        expect.assertions(1)
        isAuthenticated.mockImplementationOnce(() => true)
        await Serialization.deserialize(superadmin._id, (err, serializedUser) => {
            userHasPermissions()({...req, method: 'delete', baseUrl: '/events', route: { path: '/:eventId/register/:registrationId' }, user: serializedUser } as Request, res as Response, nextMock)
            expect(nextMock).toHaveBeenCalled()
        })
    })

    it('calls sends 401 if user doesn\'t have permissions', async () => {
        expect.assertions(1)
        isAuthenticated.mockImplementationOnce(() => true)
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            userHasPermissions()({...req, baseUrl: '/somerandomstringthatdoesn\'texist', user: serializedUser } as Request, res as Response, nextMock)
            expect(res.sendStatus).toHaveBeenCalledWith(401)
        })
    })

    describe('public', () => {

        it('calls next if \'public\' is passed in the parameters', () => {
            expect.assertions(1)
            userHasPermissions('public')(req as Request, res as Response, nextMock)
            expect(nextMock).toHaveBeenCalled()
        })

    })

})
