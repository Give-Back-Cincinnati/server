const mongoose = require('mongoose')
import { HydratedDocument } from 'mongoose'
import { IFilters } from '../src/entities/Filters'
import { IPermissions } from '../src/entities/Permissions'
import { IRoles } from '../src/entities/Roles'
import { collectPermissions } from '../utils/permissions/collectPermissions'
const { Registrations, GuestRegistration } = require('../src/entities/Registrations')
const { Events } = require('../src/entities/Events')
const { Filters } = require('../src/entities/Filters')
const { Users } = require('../src/entities/Users')
const { Roles } = require('../src/entities/Roles')
const { Permissions } = require('../src/entities/Permissions')

export const event = { _id: mongoose.Types.ObjectId(), name: "Don't Rock the Boat", description: 'This is a description...', category: 'Hands-On', address: '312 Walnut', startTime: new Date(), endTime: new Date() }
export const guestRegistration = { _id: mongoose.Types.ObjectId(), event, firstName: 'Clark', lastName: 'Kent', email: 'clark@failyplanet.com', dateOfBirth: new Date(), phone: '513-555-1234' }
export const filter: IFilters = { _id: mongoose.Types.ObjectId(), name: 'users', filter: { firstName: 'hello' } }
export const role: IRoles = { _id: mongoose.Types.ObjectId(), name: 'USER', permissions: [], filters: [filter] }
export const password = 'password'
export const user = { _id: mongoose.Types.ObjectId(), firstName: 'hello', lastName: 'world', email: 'hello@world.com', password, role }

export const superadminRole = { _id: mongoose.Types.ObjectId(), name: 'SUPERADMIN', permissions: [] }
export const superadminPassword = 'password'
export const superadmin = { _id: mongoose.Types.ObjectId(), firstName: 'super', lastName: 'admin', email: 'super@admin.com', password: superadminPassword, role: superadminRole }

declare global {
    var __MONGO_URI__: string
}

export let perm: IPermissions
export let allPermissions: HydratedDocument<IPermissions>[] = []

beforeAll(async () => {
    const { readyState } = mongoose.connection
    // only initialize the mongoose connection if the code isn't already trying to
    if (readyState === 0 || readyState === 99) {
        await mongoose.connect(global.__MONGO_URI__)
    } else {
        // wait until the mongoose connection is ready before proceeding
        //      this is used if the code is trying to connect, ignored if the beforeAll connection is
        while (mongoose.connection.readyState !== 1) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    allPermissions = await collectPermissions()
    // default user should have 
    // perm = allPermissions.filter(permission => permission.name === 'users.me.get')[0]
})

beforeEach(async () => {
    try {
        await new Events(event).save()
        await new GuestRegistration(guestRegistration).save()
        await new Filters(filter).save()
        await Promise.all(allPermissions.map(permission => {
            return new Permissions(permission).save()
        }))
    
        perm = await Permissions.findOne({ name: 'users.me.get' })
        role.permissions = [perm]
        await new Roles(role).save()
        // user needs to be saved in order to hash the password correctly
        user.role = role
        await new Users(user).save()
    
        // create a superadmin with all permissions
        superadminRole.permissions = await Permissions.find({})
        await new Roles(superadminRole).save()
        superadmin.role = superadminRole
        // superadmin needs to be saved in order to hash the password correctly
        await new Users(superadmin).save()
    } catch (e) {
        let errMessage = ''
        if (e instanceof Error) {
            errMessage = e.toString()
        }
        throw new Error("Test Error in beforeEach:" + errMessage)
    }
})

afterEach(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(global.__MONGO_URI__)
    }
	await Registrations.deleteMany()
	await Events.deleteMany()
	await Filters.deleteMany()
    await Users.deleteMany()
    await Roles.deleteMany()
    await Permissions.deleteMany()
})

afterAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(global.__MONGO_URI__)
    }
    await Users.deleteMany({})
    await Roles.deleteMany({})
    await Permissions.deleteMany({})
	await Filters.deleteMany({})
	await Events.deleteMany({})
	await Registrations.deleteMany({})
    await mongoose.disconnect()
})
