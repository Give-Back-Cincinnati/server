import { Request } from 'express'
import { SerializedUser } from 'routes/auth/serialization'

export function createFilteredQuery (query: undefined | Record<string, unknown>, req: Request): Record<string, unknown> {
    const user = (req.user as SerializedUser | undefined)
    const baseUrl = req.baseUrl.slice(1).toLowerCase()
    if (!user) return query || {}

    if (query) {
        Object.entries(query).forEach(([ key, value ]) => {
            if (value === undefined) {
                delete query[key]
            }
        })
    }

    return { ...query, ...user.hashFilters[baseUrl] }
}