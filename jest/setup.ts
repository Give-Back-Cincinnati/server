const mongoose = require('mongoose')
import { HydratedDocument } from 'mongoose'
import { IPermissions } from '../src/entities/Permissions'
import { collectPermissions } from '../utils/permissions/collectPermissions'
const { Registrations } = require('../src/entities/Registrations')
const { Events } = require('../src/entities/Events')
const { Filters } = require('../src/entities/Filters')
const { Users } = require('../src/entities/Users')
const { Roles } = require('../src/entities/Roles')
const { Permissions } = require('../src/entities/Permissions')

export const Registration = new Registrations({})
export const event = new Events({ name: "Don't Rock the Boat", description: 'This is a description...', category: 'Hands-On', address: '312 Walnut', startTime: new Date(), endTime: new Date()})
export const filter = new Filters({ name: 'Users', filter: { firstName: 'hello' } })
export const role = new Roles({ name: 'USER', permissions: [], filters: [filter] })
export const password = 'password'
export const user = new Users({ firstName: 'hello', lastName: 'world', email: 'hello@world.com', password, role })

export const superadminRole = new Roles({ name: 'SUPERADMIN', permissions: [] })
export const superadminPassword = 'password'
export const superadmin = new Users({ firstName: 'super', lastName: 'admin', email: 'super@admin.com', password: superadminPassword, role: superadminRole })

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
	await Registration.save()
	await event.save()
	await filter.save()
    await Promise.all(allPermissions.map(permission => permission.save()))

    // default user should have 
    perm = allPermissions.filter(permission => permission.name === 'users.me.get')[0]
    role.permissions = [perm]
    await role.save()
    await user.save()

    
    // create a superadmin with all permissions
    superadminRole.permissions = allPermissions
    await superadminRole.save()
    await superadmin.save()
})

afterEach(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(global.__MONGO_URI__)
    }
	await Registrations.deleteMany({ _id: { $nin: [Registration._id] } })
	await Events.deleteMany({ _id: { $nin: [event._id] } })
	await Filters.deleteMany({ _id: { $nin: [filter._id] } })
    await Users.deleteMany({ _id: { $nin: [user._id, superadmin._id] } })
    await Roles.deleteMany({ _id: { $nin: [role._id, superadminRole._id] } })
    await Permissions.deleteMany({ _id:
        { 
            $nin: [
                perm._id,
                ...allPermissions.map(({ _id }) => _id )
            ]
        }
    })
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
