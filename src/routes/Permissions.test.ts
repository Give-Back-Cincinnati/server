import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './index'
import { Permissions } from '../entities/Permissions'
import { perm, allPermissions } from '../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Permissions', () => {
    let superadminAgent: request.SuperAgentTest

    beforeAll(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/Permissions')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Permissionss', async() => {
            const response = await superadminAgent.get('/Permissions').query({limit: 1000})
            expect(response.body.length).toBe(allPermissions.length)
        })

    })

    describe('POST', () => {
        const name = 'PERMISSIONS'

        afterAll(async () => {
            await Permissions.deleteOne({ name })
        })

        it('returns a 201 with the new permission object', async () => {
            const response = await superadminAgent
                .post('/Permissions')
                .send({ name })
            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('name', name)

            const item = await Permissions.findById(response.body._id)
            expect(item).toHaveProperty('name', name)
        })

        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/Permissions').send({ _id: 'permissions' })
            expect(response.statusCode).toEqual(500)
        })

    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.get(`/Permissions/${perm._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Permissions', async () => {
                const response = await superadminAgent.get(`/Permissions/${perm._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.get(`/Permissions/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.get(`/Permissions/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/Permissions/${perm._id}`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Permissions', async () => {
                const response = await superadminAgent.patch(`/Permissions/${perm._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/Permissions/${new mongoose.Types.ObjectId()}`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/Permissions/dfghjkkjhgf`).send({ name: 'Permissions' })
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await superadminAgent.delete(`/Permissions/${perm._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Permissions', async () => {
                await superadminAgent.delete(`/Permissions/${perm._id}`)
                const found = await Permissions.findById(perm._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Permissions', async () => {
                const response = await superadminAgent.delete(`/Permissions/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await superadminAgent.delete(`/Permissions/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

    })

})
