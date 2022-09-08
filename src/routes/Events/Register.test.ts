import request from 'supertest'
import { event as item, guestRegistration, superadmin } from '../../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../../jest/utilities'
import { app } from '../index'
import { GuestRegistration, Registrations, UserRegistration } from '../../entities/Registrations'
import { Events } from '../../entities/Events'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Events/:id/register', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('/', () => {

        const registrationData = JSON.parse(JSON.stringify(guestRegistration))
        delete registrationData._id
        delete registrationData.event

        describe('GET', () => {

            it('responds 401 for unauthenticated user',  async () => {
                expect.assertions(1)
                const response = await request(app).get(`/Events/${item._id}/register`)
                expect(response.statusCode).toBe(401)
            })

            it('responds with an empty array to an unknown event id', async () => {
                expect.assertions(2)
                const response = await superadminAgent.get(`/Events/aRandomNotId/register`)
                expect(response.statusCode).toBe(200)
                expect(response.body.length).toBe(0)
            })

            it('responds with all registrations for a specific event for a superadmin', async () => {
                expect.assertions(3)
                const event1 = await new Events({ name: "Meet Your Judgement", description: 'This is a description...', category: 'Civic Engagement', address: '312 Walnut', startTime: new Date(), endTime: new Date() }).save()
                await new GuestRegistration({ event: event1, firstName: 'Clark', lastName: 'Kent', email: 'clark@failyplanet.com', dateOfBirth: new Date(), phone: '513-555-1234' }).save()
                
                const response = await superadminAgent.get(`/Events/${item._id}/register`)

                expect(response.statusCode).toBe(200)
                expect(response.body.length).toBe(1)
                expect(response.body[0].event.toString()).toBe(item._id.toString())
            })

        })

        describe('POST', () => {

            it('creates a registration for an unauthenticated user', async () => {
                expect.assertions(3)

                const response = await request(app).post(`/Events/${item._id}/register`).send(registrationData)
                const foundRegistration = await GuestRegistration.findOne({ event: item._id, email: registrationData.email })

                expect(response.statusCode).toBe(201)
                expect(foundRegistration).toHaveProperty('__t', 'GuestRegistration')
                expect(foundRegistration).toHaveProperty('email', registrationData.email)
            })

            it('creates a registration for an authenticated user, with less data', async () => {
                expect.assertions(3)

                const response = await superadminAgent.post(`/Events/${item._id}/register`)
                    .send({
                        phone: '513-555-1234',
                        dateOfBirth: new Date('01-01-1990'),
                        hasAgreedToTerms: true
                    })
                const foundRegistration = await UserRegistration.findOne({ event: item._id, user: superadmin._id })
                
                expect(response.statusCode).toBe(201)
                expect(foundRegistration).toHaveProperty('__t', 'UserRegistration')
                expect(foundRegistration).toHaveProperty('user', superadmin._id)
            })

        })        
    })

    describe('/:registrationId', () => {

        describe('PATCH', () => {

            it('returns a 200', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}/register/${guestRegistration._id}`).send({ firstName: 'Events' })
                expect(response.statusCode).toBe(200)
            })

            it('returns the updated Events', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}/register/${guestRegistration._id}`).send({ firstName: 'Superman' })
                expect(response.body).toHaveProperty('firstName', 'Superman')
            })

            it('returns a 404', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}/register/${item._id}`).send({ firstName: 'Events' })
                expect(response.statusCode).toBe(404)
            })

            it('sends a 500 if a cast error occurs on _id', async () => {
                const response = await superadminAgent.patch(`/Events/${item._id}/register/guestRegistration._id`).send({ firstName: 'Events' })
                expect(response.statusCode).toBe(500)
            })

            it('returns a 401 for a user without permissions', async () => {
                const response = await request(app).patch(`/Events/${item._id}/register/${guestRegistration._id}`).send({ firstName: 'Events' })
                expect(response.statusCode).toBe(401)
            })

        })

        describe('DELETE', () => {
            it('cannot be deleted by an unauthenticated user', async () => {
                expect.assertions(1)
    
                const response = await request(app)
                    .delete(`/Events/${item._id}/register/${guestRegistration._id}`)
                    .send()
                
                expect(response.statusCode).toBe(401)
            })
    
            it('can be deleted by a superadmin', async () => {
                expect.assertions(3)

                // make sure it exists to start
                const dbRegistration = await Registrations.find({ _id: guestRegistration._id })
                expect(dbRegistration).toHaveLength(1)

                const response = await superadminAgent
                    .delete(`/Events/${item._id}/register/${guestRegistration._id}`)
                    .send()
                expect(response.statusCode).toBe(204)
                
                const foundUsers = await Registrations.find({ _id: guestRegistration._id})
                expect(foundUsers).toHaveLength(0)
            })
        })
    })
})
