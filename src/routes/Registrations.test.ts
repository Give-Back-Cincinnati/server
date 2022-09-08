import request from 'supertest'
import { event } from '../../jest/setup'
import { getLoggedInSuperAdminAgent } from '../../jest/utilities'
import { app } from './index'

// suppress error messages
jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))

describe('/api/Registrations', () => {
    let superadminAgent: request.SuperAgentTest

    beforeEach(async () => {
        superadminAgent = await getLoggedInSuperAdminAgent(app)
    })

    describe('GET', () => {

        it('returns a 200', async () => {
            const response = await superadminAgent.get('/Registrations')
            expect(response.statusCode).toBe(200)
        })
        
        it('returns all events with registration details', async() => {
            const response = await superadminAgent.get('/Registrations')

            expect(response.body.length).toBe(1)
            expect(response.body[0]).toHaveProperty('_id', event._id.toString())
            expect(response.body[0]).toHaveProperty('registrations', 1)
        })

    })

})
