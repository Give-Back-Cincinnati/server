import mongoose from 'mongoose'
import request from 'supertest'
import { event as item } from '../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import { app } from './index'
import { Events } from '../entities/Events'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Events', () => {
    let superadminAgent: request.SuperAgentTest

    beforeAll(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/Events')
            expect(response.statusCode).toBe(200)
        })
        
        it('returns all Eventss', async() => {
            const response = await superadminAgent.get('/Events')
            expect(response.body.length).toBe(1)
        })
        
        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).get('/Events')
            expect(response.statusCode).toBe(401)
        })

        it('returns a 500 if the query is malformed', async () => {
            const response = await superadminAgent
                .get('/Events')
                .query({ _id: 'asdafas' })
            expect(response.statusCode).toBe(500)
        })

    })

    describe('POST', () => {
            
        it('returns a 201', async () => {
            const response = await superadminAgent.post('/Events').send({})
            expect(response.statusCode).toBe(201)
        })

        it('returns the new Events', async () => {
            const response = await superadminAgent.post('/Events').send({ name: 'Events' })
            expect(response.body).toHaveProperty('name', 'Events')
        })

        it('inserts the new Events', async () => {
            const response = await superadminAgent.post('/Events').send({ name: 'Events' })
            const item = await Events.findById(response.body._id)
            expect(item).toHaveProperty('name', 'Events')
        })

        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).post('/Events').send({ name: 'Events' })
            expect(response.statusCode).toBe(401)
        })

        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/Events').send({ _id: 'asdasfas' })
            expect(response.statusCode).toEqual(500)
        })
    
    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.get(`/Events/${item._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Events', async () => {
                const response = await superadminAgent.get(`/Events/${item._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.get(`/Events/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.get(`/Events/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).get(`/Events/${item._id}`)
                expect(response.statusCode).toBe(401)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}`).send({ name: 'Events' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Events', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/Events/${new mongoose.Types.ObjectId()}`).send({ name: 'Events' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/Events/dfghjkkjhgf`).send({ name: 'Events' })
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).patch(`/Events/${item._id}`).send({ name: 'Events' })
                expect(response.statusCode).toBe(401)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await superadminAgent.delete(`/Events/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Events', async () => {
                await superadminAgent.delete(`/Events/${item._id}`)
                const found = await Events.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Events', async () => {
                const response = await superadminAgent.delete(`/Events/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await superadminAgent.delete(`/Events/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).delete(`/Events/${item._id}`)
                expect(response.statusCode).toBe(401)
            })

        })
    
    })

})
