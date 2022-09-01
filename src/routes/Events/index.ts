import { logger } from '../../config/index'
import { Router, Response, Request } from 'express'
import { Events } from '../../entities/Events'
import { userHasPermissions } from '../auth/middleware'
import { createFilteredQuery, createQueryOptions } from '../../entities/queryUtils'

import { getRegistrations, createRegistration, deleteRegistration } from './Register'

/**
 * @openapi
 * tags: 
 *  - name: events
 *    description: Events
 */
const router = Router()
/**
 * @openapi
 * /events:
 *  get:
 *    tags:
 *      - events
 *    operationId: searchEvents
 *    summary: Search Events records
 *    description: Get Events records
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
 *            enum: [name, category, startTime, endTime]
 *      - in: query
 *        name: order
 *        schema:
 *            type: string
 *            enum: [asc, desc]
 *            default: asc
 *      - in: query
 *        name: name
 *        type: string
 *      - in: query
 *        name: category
 *        schema:
 *          $ref: '#/components/schemas/EventCategories'
 *      - in: query
 *        name: startTime
 *        schema:
 *          type: string
 *          format: date-time
 *      - in: query
 *        name: endTime
 *        schema:
 *          type: string
 *          format: date-time
 *    responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Events'
 *  post:
 *    tags:
 *      - events
 *    operationId: createEvents
 *    summary: Create a Events record
 *    description: Create a new Events record
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Events'
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Events'
 */
router.route('/')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const { name, category, startTime, endTime }: { 
                name?: string,
                category?: string,
                startTime?: string,
                endTime?: string
            } = req.query

            const searchFor = {
                name, category, startTime, endTime
            }

            const queryOptions = createQueryOptions(req.query)
            
            const items = await Events.find(createFilteredQuery(searchFor, req), undefined, queryOptions)
            return res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .post(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = new Events(req.body)
            await item.save()
            res.status(201).json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

/**
 * @openapi
 * /events/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  get:
 *      tags:
 *          - events
 *      operationId: getEvents
 *      summary: Get a single Events record
 *      description: Get a single Events record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Events'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  patch:
 *      tags:
 *          - events
 *      operationId: updateEvents
 *      summary: Update a single Events record
 *      description: Update a single Events record
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Events'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - events
 *      operationId: deleteEvents
 *      summary: Delete a Events record
 *      description: Delete a Events record
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
            const item = await Events.findOne(createFilteredQuery({ _id: req.params.id }, req))
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
            const item = await Events.findOneAndUpdate(
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
            const item = await Events.deleteOne(createFilteredQuery({ _id: req.params.id }, req))
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


router.route('/:eventId/register')
    .get(userHasPermissions(), getRegistrations)
    .post(userHasPermissions('public'), createRegistration)

router.route('/:eventId/register/:registrationId')
    .delete(userHasPermissions(), deleteRegistration)

export default router
