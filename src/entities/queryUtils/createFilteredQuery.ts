import { Request } from 'express'
import { SerializedUser } from 'routes/auth/serialization'

export function createFilteredQuery (query: undefined | Record<string, unknown>, req: Request): Record<string, unknown> {
    const user = (req.user as SerializedUser | undefined)
    const baseUrl = req.baseUrl.slice(1).toLowerCase()
    if (query) {
        Object.entries(query).forEach(([ key, value ]) => {
            if (value === undefined) {
                delete query[key]
            }
        })
    }
    if (!user) return query || {}

    return { ...query, ...user.hashFilters[baseUrl] }
}