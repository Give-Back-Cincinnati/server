import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Permissions } from '../entities/Permissions'
import { userHasPermissions } from "./auth/middleware"
import { createFilteredQuery, createQueryOptions } from '../entities/queryUtils'

/**
 * @openapi
 * tags: 
 *  - name: permissions
 *    description: Granular permissions systems
 */
const router = Router()

/**
 * @openapi
 * /permissions:
 *  get:
 *    tags:
 *      - permissions
 *    operationId: searchPermissions
 *    summary: Search permissions records
 *    description: Get permissions records
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
 *            enum: [name, group]
 *      - in: query
 *        name: order
 *        schema:
 *            type: string
 *            enum: [asc, desc]
 *            default: asc
 *    responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Permissions'
 *  post:
 *    tags:
 *      - permissions
 *    operationId: createPermission
 *    summary: Create a permissions record
 *    description: Create a new permissions record
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Permissions'
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Permissions'
 */
router.route('/')
    .get(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const { search }: { 
                search?: Record<string, unknown>,
            } = req.query

            const queryOptions = createQueryOptions(req.query)
            
            const items = await Permissions.find(createFilteredQuery(search as Record<string,unknown>, req), undefined, queryOptions)
            res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .post(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = new Permissions(req.body)
            await item.save()
            res.status(201).json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

/**
 * @openapi
 * /permissions/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  get:
 *      tags:
 *          - permissions
 *      operationId: getPermission
 *      summary: Get a single permissions record
 *      description: Get a single permissions record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Permissions'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  patch:
 *      tags:
 *          - permissions
 *      operationId: updatePermission
 *      summary: Update a single permissions record
 *      description: Update a single permissions record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Permissions'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - permissions
 *      operationId: deletePermission
 *      summary: Delete a permissions record
 *      description: Delete a permissions record
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
            const item = await Permissions.findOne(createFilteredQuery({ _id: req.params.id }, req))
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
            const item = await Permissions.findOneAndUpdate(
                createFilteredQuery({ _id: req.params.id }, req),
                req.body,
                { new: true }
            )
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
    .delete(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await Permissions.deleteOne(createFilteredQuery({ _id: req.params.id }, req))
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
