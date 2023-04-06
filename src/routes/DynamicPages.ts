import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { DynamicPages } from '../entities/DynamicPages'
import { userHasPermissions } from './auth/middleware'
import { createFilteredQuery, createQueryOptions } from '../entities/queryUtils'

/**
 * @openapi
 * tags: 
 *  - name: dynamicpages
 *    description: DynamicPages
 */
const router = Router()
/**
 * @openapi
 * /dynamicpages:
 *  get:
 *    tags:
 *      - dynamicpages
 *    operationId: searchDynamicPages
 *    summary: Search DynamicPages records
 *    description: Get DynamicPages records
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *            type: integer
 *            minimum: 1
 *      - in: query
 *        name: offset
 *        schema:
 *            type: integer
 *      - in: query
 *        name: sort
 *        schema:
 *            type: string
 *            enum: [name, url]
 *      - in: query
 *        name: order
 *        schema:
 *            type: string
 *            enum: [asc, desc]
 *            default: asc
 *      - in: query
 *        name: url
 *        schema:
 *          type: string
 *    responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/DynamicPages'
 *  post:
 *    tags:
 *      - dynamicpages
 *    operationId: createDynamicPages
 *    summary: Create a DynamicPages record
 *    description: Create a new DynamicPages record
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/DynamicPages'
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/DynamicPages'
 */
router.route('/')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const { name, url }: {
                name?: string,
                url?: string,
            } = req.query

            const searchFor: Record<string, unknown> = {
                name
            }

            if (url) {
                searchFor.url = new RegExp(url)
            }

            const queryOptions = createQueryOptions(req.query)

            const items = await DynamicPages.find(createFilteredQuery(searchFor, req), undefined, queryOptions)
            res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .post(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = new DynamicPages(req.body)
            await item.save()
            res.status(201).json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

/**
 * @openapi
 * /dynamicpages/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  get:
 *      tags:
 *          - dynamicpages
 *      operationId: getDynamicPages
 *      summary: Get a single DynamicPages record
 *      description: Get a single DynamicPages record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DynamicPages'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  patch:
 *      tags:
 *          - dynamicpages
 *      operationId: updateDynamicPages
 *      summary: Update a single DynamicPages record
 *      description: Update a single DynamicPages record
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/DynamicPages'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DynamicPages'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - dynamicpages
 *      operationId: deleteDynamicPages
 *      summary: Delete a DynamicPages record
 *      description: Delete a DynamicPages record
 *      responses:
 *          204:
 *              description: Success
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 */
router.route('/:id')
    .get(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await DynamicPages.findOne(createFilteredQuery({ _id: req.params.id }, req))
            if (item) {
                res.json(item)
                return
            }
            res.sendStatus(404)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .patch(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await DynamicPages.findOne(createFilteredQuery({ _id: req.params.id }, req))
            if (!item) return res.sendStatus(404)

            item.set(req.body)
            await item.save()

            res.json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .delete(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await DynamicPages.deleteOne(createFilteredQuery({ _id: req.params.id }, req))
            if (item.deletedCount === 1) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

export default router
