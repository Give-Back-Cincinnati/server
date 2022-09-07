import { establishMongooseConnection } from "../../src/mongodb"
import { HydratedDocument } from 'mongoose'
import { Permissions, IPermissions } from "../../src/entities/Permissions"
import { Roles } from "../../src/entities/Roles"

import { collectPermissions } from './collectPermissions'

async function seedPermissions () {
    const permissionsList: HydratedDocument<IPermissions>[] = await collectPermissions()

    try {
        await establishMongooseConnection()
    } catch (e: any) {
        console.log(e?.message)
        process.exit(1)
    }

    // TODO delete permissions that no longer exist
    const allCurrentPermissions = await Permissions.find({})
    const hashedCurrentPermissions = allCurrentPermissions.reduce((acc: Record<string, IPermissions>, curr) => {
        acc[curr.name] = curr
        return acc
    }, {})

    const savedPermissions = await Promise.all(permissionsList.map(async (permission: HydratedDocument<IPermissions>) => {
        const { name, group } = permission
        if (hashedCurrentPermissions[name]) {
            // remove from current permissions, anything left at the end will be deleted
            delete hashedCurrentPermissions[name]
        }
        return Permissions.findOneAndUpdate({ name: permission.name }, {
            name, group
        }, { upsert: true, returnDocument: 'after' })
    }))

    await Permissions.deleteMany({ _id: { $in: Object.values(hashedCurrentPermissions).map(({ _id }) => _id) } })

    await Roles.findOneAndUpdate(
        { name: 'SUPERADMIN' },
        {
            name: 'SUPERADMIN',
            permissions: savedPermissions
        },
        { upsert: true }
    )

    await Roles.findOneAndUpdate(
        { name: 'USER' },
        { name: 'USER', permissions: savedPermissions.filter((permission: HydratedDocument<unknown, IPermissions>) => permission.name === 'users.me.get')},
        { upsert: true }
    )

    process.exit()
}

seedPermissions()
