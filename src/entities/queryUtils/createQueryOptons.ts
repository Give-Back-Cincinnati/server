import type { Request } from 'express'
import { QueryOptions } from 'mongoose';

export function createQueryOptions (query: Record<string, unknown>): QueryOptions {
    const { limit = '20', sort, order = 'asc', ...other }: { 
        limit?: string,
        sort?: string,
        order?: string,
        other?: unknown
    } = query

    const queryOptions: QueryOptions = { limit: parseInt(limit as string) }

    if (sort && sort === typeof 'string') {
        queryOptions.sort = { [sort]: order }
    }

    return queryOptions
}