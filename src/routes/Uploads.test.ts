import mongoose from 'mongoose'
import request from 'supertest'
import { upload as item } from '../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import { app } from './index'
import { Uploads } from '../entities/Uploads'
import { useServices } from '../services'

const fakePresignedUrl = "https://random/key.png"

jest.mock('../services', () => ({
    useServices: () => ({
        getPresignedUrl: (key: string) => fakePresignedUrl
    })
}))

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Uploads', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/Uploads')
            expect(response.statusCode).toBe(200)
        })
        
        it('returns all Uploadss', async() => {
            const response = await superadminAgent.get('/Uploads')
            expect(response.body.length).toBe(1)
        })
        
        // remove this for public routes
        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).get('/Uploads')
            expect(response.statusCode).toBe(401)
        })

    })

    describe('POST', () => {
        const name = 'Uploads.png'
        const mimeType = 'image/png'
            
        it('returns a 201', async () => {
            const response = await superadminAgent.post('/Uploads').send({ name, mimeType })
            expect(response.statusCode).toBe(201)
        })

        it('returns a presigned url and the _id', async () => {
            const response = await superadminAgent.post('/Uploads').send({ name, mimeType })
            expect(response.body).toHaveProperty('_id', expect.any(String))
            expect(response.body).toHaveProperty('uploadUrl', fakePresignedUrl)
        })

        it('inserts the new Uploads', async () => {
            const response = await superadminAgent.post('/Uploads').send({ name, mimeType })
            const item = await Uploads.findById(response.body._id)
            expect(item).toHaveProperty('name', name.toLowerCase())
        })

        it('returns a 400 if the mime-type is not valid', async () => {
            expect.assertions(2)
            const fakeMimeType = 'notAReal/mimetype'

            const response = await superadminAgent.post('/Uploads').send({ name, mimeType: fakeMimeType })
            expect(response.statusCode).toBe(400)
            expect(response.text).toEqual(`Invalid filetype, received: ${fakeMimeType}`)
        })

        it('returns a 401 for a user without permissions', async () => {
            const response = await request(app).post('/Uploads').send({ name, mimeType })
            expect(response.statusCode).toBe(401)
        })

        it('returns 500 if the body is malformed', async () => {
            const response = await superadminAgent.post('/Uploads').send({ _id: 'asdasfas', mimeType })
            expect(response.statusCode).toEqual(500)
        })
    
    })

    describe('/:id', () => {

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/Uploads/${item._id}`).send()
                expect(response.statusCode).toBe(200)
            })

            it('updates the isLive to true', async () => {
                const found = await Uploads.findById(item._id)
                expect(found).toHaveProperty('isLive', false)

                const response = await superadminAgent.patch(`/Uploads/${item._id}`).send()
                expect(response.body).toHaveProperty('isLive', true)
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/Uploads/${new mongoose.Types.ObjectId()}`).send()
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/Uploads/dfghjkkjhgf`).send()
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).patch(`/Uploads/${item._id}`).send()
                expect(response.statusCode).toBe(401)
            })

        })

        describe('DELETE', () => {

            it('returns a 204', async () => {
                const response = await superadminAgent.delete(`/Uploads/${item._id}`)
                expect(response.statusCode).toBe(204)
            })

            it('deletes the Uploads', async () => {
                await superadminAgent.delete(`/Uploads/${item._id}`)
                const found = await Uploads.findById(item._id)
                expect(found).toBeNull()
            })

            it('tries to delete a nonexistent Uploads', async () => {
                const response = await superadminAgent.delete(`/Uploads/${new mongoose.Types.ObjectId()}`)
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if an error occurs', async () => {
                const response = await superadminAgent.delete(`/Uploads/dfghjkkjhgf`)
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).delete(`/Uploads/${item._id}`)
                expect(response.statusCode).toBe(401)
            })

        })
    
    })

})
