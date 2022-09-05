import mongoose from 'mongoose'
import request from 'supertest'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import { filter } from '../../jest/setup'
import { app } from './index'
import { Filters } from '../entities/Filters'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Filters', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/Filters')
            expect(response.statusCode).toBe(200)
        })
        
        it('returns all Filterss', async() => {
            const response = await superadminAgent.get('/Filters')
            expect(response.body.length).toBe(1)
        })
        
        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).get('/Filters')
            expect(response.statusCode).toBe(401)
        })

    })

    describe('POST', () => {
            
        it('returns a 201', async () => {
            const response = await superadminAgent.post('/Filters').send({ name: 'Filters' })
            expect(response.statusCode).toBe(201)
        })

        it('returns the new Filters', async () => {
            const response = await superadminAgent.post('/Filters').send({ name: 'Filters' })
            expect(response.body).toHaveProperty('name', 'filters')
        })

        it('inserts the new Filters', async () => {
            const response = await superadminAgent.post('/Filters').send({ name: 'Filters' })
            const item = await Filters.findById(response.body._id)
            expect(item).toHaveProperty('name', 'filters')
        })
        
        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).post('/Filters').send({ name: 'Filters' })
            expect(response.statusCode).toBe(401)
        })
        
        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/Filters').send({ _id: 'Filters' })
            expect(response.statusCode).toEqual(500)
        })
    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.get(`/Filters/${filter._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Filters', async () => {
                const response = await superadminAgent.get(`/Filters/${filter._id}`)
                
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.get(`/Filters/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.get(`/Filters/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).get(`/Filters/${filter._id}`)
                expect(response.statusCode).toBe(401)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/Filters/${filter._id}`).send({ name: 'filters' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Filters', async () => {
                const response = await superadminAgent.patch(`/Filters/${filter._id}`).send({ name: 'Superman' })
                expect(response.body).toHaveProperty('name', 'superman')
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/Filters/${new mongoose.Types.ObjectId()}`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/Filters/dfghjkkjhgf`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).patch(`/Filters/${filter._id}`).send({ name: 'Filters' })
                expect(response.statusCode).toBe(401)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await superadminAgent.delete(`/Filters/${filter._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Filters', async () => {
                await superadminAgent.delete(`/Filters/${filter._id}`)
                const found = await Filters.findById(filter._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Filters', async () => {
                const response = await superadminAgent.delete(`/Filters/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await superadminAgent.delete(`/Filters/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).delete(`/Filters/${filter._id}`)
                expect(response.statusCode).toBe(401)
            })

        })
    
    })

})
