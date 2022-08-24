import { establishMongooseConnection } from "../src/mongodb"
import { Roles } from "../src/entities/Roles"
import { Users } from '../src/entities/Users'


// example usage: `yarn user:setRole technology@givebackcincinnati.org SUPERADMIN`
async function upgradeUser (email: string, role: string) {
    try {
        await establishMongooseConnection()
        const foundRole = await Roles.findOne({ name: role.toUpperCase() })
        if (!foundRole) throw new Error(`${role} not found`)
    
        await Users.updateOne({ email: email.toLowerCase() }, { role: foundRole })
    } catch (e: any) {
        console.error(e?.message)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

const email = process.argv[2]
const role = process.argv[3]

upgradeUser(email, role)