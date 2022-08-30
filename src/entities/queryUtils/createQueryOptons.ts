import { QueryOptions } from 'mongoose'

export type Query = { 
    limit?: string,
    sort?: string,
    order?: string,
    other?: unknown
}

export function createQueryOptions (query: Record<string, unknown>): QueryOptions {
    const { limit = '20', sort, order = 'asc' }: Query = query

    const queryOptions: QueryOptions = { limit: parseInt(limit as string) }

    if (sort && typeof sort === 'string') {
        queryOptions.sort = { [sort]: order }
    }

    return queryOptions
}