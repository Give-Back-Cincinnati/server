import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Roles } from '../entities/Roles'
import { userHasPermissions } from "./auth/middleware"
import { createFilteredQuery, createQueryOptions } from '../entities/queryUtils'

/**
 * @openapi
 * tags: 
 *  - name: roles
 *    description: Roles to assign users
 */
const router = Router()
/**
 * @openapi
 * /roles:
 *  get:
 *    tags:
 *      - roles
 *    operationId: searchRoles
 *    summary: Search roles records
 *    description: Get roles records
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
 *            enum: [name]
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
 *                      $ref: '#/components/schemas/Roles'
 *  post:
 *    tags:
 *      - roles
 *    operationId: createRole
 *    summary: Create a roles record
 *    description: Create a new roles record
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Roles'
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Roles'
 */
router.route('/')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const { search }: { 
                search?: Record<string, unknown>,
            } = req.query

            const queryOptions = createQueryOptions(req.query)
            
            const items = await Roles.find(createFilteredQuery(search as Record<string,unknown>, req), undefined, queryOptions)
            res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .post(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = new Roles(req.body)
            await item.save()
            res.status(201).json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

/**
 * @openapi
 * /roles/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  get:
 *      tags:
 *          - roles
 *      operationId: getRole
 *      summary: Get a single roles record
 *      description: Get a single roles record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Roles'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  patch:
 *      tags:
 *          - roles
 *      operationId: updateRole
 *      summary: Update a single roles record
 *      description: Update a single roles record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Roles'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - roles
 *      operationId: deleteRole
 *      summary: Delete a roles record
 *      description: Delete a roles record
 *      responses:
 *          204:
 *              description: Success
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 */
router.route('/:id')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.findOne(createFilteredQuery({ _id: req.params.id }, req))
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
    .patch(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.findOneAndUpdate(
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
    .delete(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const item = await Roles.deleteOne(createFilteredQuery({ _id: req.params.id }, req))
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
