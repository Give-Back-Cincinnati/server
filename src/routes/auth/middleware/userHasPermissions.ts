import { Request, Response, NextFunction, RequestHandler } from 'express'
import { SerializedUser } from "../serialization"
import { publicRoute } from "./publicRoute"

function permissionsCheck (req: Request, res: Response, next: NextFunction) {
    // exit if the request is not from a logged-in user
    if (!req.isAuthenticated()) return res.sendStatus(401)

    // parse request to create permissions string
    const baseUrl = req.baseUrl.slice(1).toLowerCase()
    const path = req.route.path.slice(1).replace(/:/g, '').replace(/\//g, '.').toLowerCase()
    const method = req.method.toLowerCase()

    // create permissions string
    const permission = `${baseUrl}.${path ? path + '.' : ''}${method}`

    const user = (req.user as SerializedUser)
    if (user.hashPermissions) {
        // see if user has permission string in their hashPermissions
        const hasPermission = user.hashPermissions[permission]
        if (hasPermission) {
            return next()
        }
    }

    // user does not have permissions, send a 401 Unauthorized error
    res.sendStatus(401)
}

export const userHasPermissions: (permissionString?: 'public') => RequestHandler = (permissionString) => {
    switch (permissionString) {
        case 'public':
            return publicRoute
        default:
            return permissionsCheck
    }
}

export default userHasPermissions
