import mongoose from 'mongoose'
import request from 'supertest'
import { dynamicpage as item } from '../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import { app } from './index'
import { DynamicPages } from '../entities/DynamicPages'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/DynamicPages', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/DynamicPages')
            expect(response.statusCode).toBe(200)
        })
        
        it('returns all DynamicPagess', async() => {
            const response = await superadminAgent.get('/DynamicPages')
            expect(response.body.length).toBe(1)
        })

        it('returns a 200 for a user without permissions', async () => {
            const response = await request(app).get('/DynamicPages')
            expect(response.statusCode).toBe(200)
        })

    })

    describe('POST', () => {
            
        it('returns a 201', async () => {
            const response = await superadminAgent.post('/DynamicPages').send({})
            expect(response.statusCode).toBe(201)
        })

        it('returns the new DynamicPages', async () => {
            const response = await superadminAgent.post('/DynamicPages').send({ name: 'DynamicPages' })
            expect(response.body).toHaveProperty('name', 'DynamicPages')
        })

        it('inserts the new DynamicPages', async () => {
            const response = await superadminAgent.post('/DynamicPages').send({ name: 'DynamicPages' })
            const item = await DynamicPages.findById(response.body._id)
            expect(item).toHaveProperty('name', 'DynamicPages')
        })

        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).post('/DynamicPages').send({ name: 'DynamicPages' })
            expect(response.statusCode).toBe(401)
        })

        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/DynamicPages').send({ _id: 'asdasfas' })
            expect(response.statusCode).toEqual(500)
        })
    
    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.get(`/DynamicPages/${item._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the DynamicPages', async () => {
                const response = await superadminAgent.get(`/DynamicPages/${item._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.get(`/DynamicPages/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.get(`/DynamicPages/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).get(`/DynamicPages/${item._id}`)
                expect(response.statusCode).toBe(401)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/DynamicPages/${item._id}`).send({ name: 'DynamicPages' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated DynamicPages', async () => {
                const response = await superadminAgent.patch(`/DynamicPages/${item._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/DynamicPages/${new mongoose.Types.ObjectId()}`).send({ name: 'DynamicPages' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/DynamicPages/dfghjkkjhgf`).send({ name: 'DynamicPages' })
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).patch(`/DynamicPages/${item._id}`).send({ name: 'DynamicPages' })
                expect(response.statusCode).toBe(401)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await superadminAgent.delete(`/DynamicPages/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the DynamicPages', async () => {
                await superadminAgent.delete(`/DynamicPages/${item._id}`)
                const found = await DynamicPages.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent DynamicPages', async () => {
                const response = await superadminAgent.delete(`/DynamicPages/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await superadminAgent.delete(`/DynamicPages/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).delete(`/DynamicPages/${item._id}`)
                expect(response.statusCode).toBe(401)
            })

        })
    
    })

})
