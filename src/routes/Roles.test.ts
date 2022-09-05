import request from 'supertest'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import mongoose from 'mongoose'
import { app } from './index'
import { IRoles, Roles} from '../entities/Roles'
import {role} from '../../jest/setup'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Roles', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await request(app).get('/Roles')
            expect(response.statusCode).toBe(200)
        })

        it('returns all Roles', async () => {
            const response = await request(app).get('/Roles')
            expect(response.body.length).toBe(2)
        })

    })

    describe('POST', () => {

        it('returns a 201 and the new Roles', async () => {
            const response = await request(app).post('/Roles').send({name: 'Roles'})
            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('name', 'ROLES')
        })

        it('inserts the new Roles', async () => {
            const response = await request(app).post('/Roles').send({name: 'Roles'})
            const item = await Roles.findById(response.body._id)
            expect(item).toHaveProperty('name', 'ROLES')
        })

        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/Roles').send({ _id: 'asdasfas' })
            expect(response.statusCode).toEqual(500)
        })
    })

    describe('/:id', () => {

        describe('GET', () => {

            it('returns a 200', async () => {
                const response = await request(app).get(`/Roles/${role._id}`)
                expect(response.statusCode).toBe(200)
            })

            it('returns the Roles', async () => {
                const response = await request(app).get(`/Roles/${role._id}`)
                expect(response.body).toHaveProperty('_id', expect.any(String))
                expect(response.body).toHaveProperty('__v', 0)
            })

            it('returns a 404', async () => {
                const response = await request(app).get(`/Roles/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).get(`/Roles/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await request(app).patch(`/Roles/${role._id}`).send({name: 'Roles'})
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Roles', async () => {
                const response = await request(app).patch(`/Roles/${role._id}`).send({name: 'Superman'})
                expect(response.body).toHaveProperty('name', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await request(app).patch(`/Roles/${new mongoose.Types.ObjectId()}`).send({name: 'Roles'})
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await request(app).patch(`/Roles/dfghjkkjhgf`).send({name: 'Roles'})
                expect(response.statusCode).toBe(500)
            })

        })

        describe('DELETE', () => {
            let entity: mongoose.Document<unknown, unknown, IRoles> & IRoles & { _id: mongoose.Types.ObjectId }
            beforeEach(async () => {
                entity = new Roles({ name: 'random' })
                await entity.save()
            })

            it('returns a 204', async () => {
                const response = await request(app).delete(`/Roles/${entity._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Roles', async () => {
                await request(app).delete(`/Roles/${entity._id}`)
                const found = await Roles.findById(entity._id)
                expect(found).toBeNull()
            })

            it('sends 404 if deleting a nonexistent Roles', async () => {
                const response = await request(app).delete(`/Roles/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await request(app).delete(`/Roles/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

        })

    })

})
