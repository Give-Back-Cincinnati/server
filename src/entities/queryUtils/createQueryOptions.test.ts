import { createQueryOptions, Query } from './createQueryOptons'

describe('createQueryOptions', () => {
    let baseQuery: Query

    beforeAll(() => {
        baseQuery = {
            limit: '20',
            sort: 'item',
            order: 'desc',
            // other: ''
        }
    })

    it('converts limit to a number', () => {
        let returned = createQueryOptions(baseQuery)
        expect(typeof returned.limit).toBe('number')
    })

    it('defaults limit to 20', () => {
        let returned = createQueryOptions({})
        expect(returned.limit).toBe(20)
    })

    it ('adds sort to the response with the correct order', () => {
        let returned = createQueryOptions(baseQuery)
        if (baseQuery.sort) {
            expect(returned.sort).toEqual({ [baseQuery.sort]: baseQuery.order })
        } else {
            throw new Error('Base Query does not have sort property')
        }
    })
    
    it('defaults sort order to ascending', () => {
        let returned = createQueryOptions({ sort: 'item' })
        if (baseQuery.sort) {
            expect(returned.sort).toEqual({ [baseQuery.sort]: 'asc' })
        } else {
            throw new Error('Base Query does not have sort property')
        }
    })

})