import { superadmin, superadminPassword } from "../setup"
import request, { agent } from 'supertest'
import Express from 'express'

export async function getLoggedInSuperAdminAgent (app: Express.Application): Promise<request.SuperAgentTest> {
    const agent = request.agent(app) 
    const res = await agent
        .post('/auth/login')
        .send(
            {
                email: superadmin.email,
                password: superadminPassword
            }
        )
    if(res.statusCode !== 204) {
        console.log(res.text)
        throw new Error(`SuperAdmin Login Failed With Status: ${res.statusCode}`)
    }
    return agent 
}
