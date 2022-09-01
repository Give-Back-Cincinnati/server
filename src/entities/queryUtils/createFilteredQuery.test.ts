import { Request } from 'express'
import { createFilteredQuery } from './createFilteredQuery'
import { user, perm, filter } from '../../../jest/setup'
import { Serialization, SerializedUser } from '../../routes/auth/serialization'

describe('createFilteredQuery', () => {
    let userReq: Partial<Request>
    let reqBase: Record<string, unknown>
    beforeAll(async () => {
        reqBase = {
            baseUrl: '/Permissions',
            route: {
                path: `/${perm._id}`
            },
            method: 'get',
        }
        await Serialization.deserialize(user._id, (err, serializedUser) => {
            if (serializedUser) {
                userReq = {
                    user: serializedUser as SerializedUser,
                    ...reqBase
                }
            } else {
                throw new Error('Test broke, user not serialized')
            }
        })
    })

    it('returns an object', () => {
        expect(typeof createFilteredQuery({}, userReq as Request)).toBe('object')
    })

    it('returns the same object if no user is present', () => {
        const query = { name: 'Superman' }
        expect(createFilteredQuery(query, reqBase as Partial<Request> as Request)).toBe(query)
    })

    it('returns a sanitized object if no user is present', () => {
        const query = { name: undefined }
        expect(createFilteredQuery(query, reqBase as Partial<Request> as Request)).not.toHaveProperty('name')
    })

    it('returns the same object if no filter is present on the user', () => {
        const query = { name: 'Superman' }
        expect(JSON.stringify(createFilteredQuery(query, userReq as Request))).toBe(JSON.stringify(query))
    })

    it('merges a query with a filter', () => {
        const query = { name: 'Superman' }
        userReq.user as SerializedUser
        const returnedQuery = createFilteredQuery(query, ({...userReq, baseUrl: `/${filter.name}` }) as Request)

        const filterKey = Object.keys(filter.filter)[0]

        expect(returnedQuery).toHaveProperty('name', query.name)
        expect(returnedQuery).toHaveProperty(filterKey, filter.filter[filterKey])
    })

    it('return the filter if query is undefined', () => {
        userReq.user as SerializedUser
        const returnedQuery = createFilteredQuery(undefined, ({...userReq, baseUrl: `/${filter.name}` }) as Request)

        const filterKey = Object.keys(filter.filter)[0]

        expect(returnedQuery).toHaveProperty(filterKey, filter.filter[filterKey])
    })

    it('returns an empty object if no query and no hashFilter', () => {
        userReq.user as SerializedUser
        const returnedQuery = createFilteredQuery(undefined, ({...userReq, baseUrl: `/asd` }) as Request)

        expect(returnedQuery).toEqual({})
    })

    it('removes undefined values from the query', () => {
        const query = { name: undefined }
        userReq.user as SerializedUser
        const returnedQuery = createFilteredQuery(query, ({...userReq, baseUrl: `/${filter.name}` }) as Request)

        const filterKey = Object.keys(filter.filter)[0]

        expect(returnedQuery).not.toHaveProperty('name')
        expect(returnedQuery).toHaveProperty(filterKey, filter.filter[filterKey])
    })

})