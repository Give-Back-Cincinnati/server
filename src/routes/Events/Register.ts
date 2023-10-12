import { logger } from '../../config/index'
import { Response, Request } from 'express'
import { Registrations, GuestRegistration, UserRegistration } from '../../entities/Registrations'
import { Events } from '../../entities/Events'
import {
    createFilteredQuery, createQueryOptions,
    //  createQueryOptions
} from '../../entities/queryUtils'
import { IUser } from 'entities/Users'

/**
 * @openapi
 * /events/{eventId}/register:
 *  parameters:
 *      - in: path
 *        name: eventId
 *  get:
 *      tags:
 *          - registrations
 *      operatonId: getEventRegistrations
 *      summary: Get Registrations for a specific event
 *      description: Get registrations for a specific event.
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *                type: integer
 *                minimum: 1
 *          - in: query
 *            name: offset
 *            schema:
 *                type: integer
 *          - in: query
 *            name: sort
 *            schema:
 *                type: string
 *                enum: [name, category, startTime, endTime]
 *          - in: query
 *            name: order
 *            schema:
 *                type: string
 *                enum: [asc, desc]
 *                default: asc
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      oneOf:
 *                          - $ref: '#/components/schemas/UserRegistration'
 *                          - $ref: '#/components/schemas/GuestRegistration'
 *  post:
 *      tags:
 *          - registrations
 *      operatonId: registerForEvent
 *      summary: Register for an Event
 *      description: Register for a specific event, either as a logged in user or a guest user.
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      oneOf:
 *                          - $ref: '#/components/schemas/UserRegistration'
 *                          - $ref: '#/components/schemas/GuestRegistration'
 *      responses:
 *          201:
 *              description: Created
 */
export const getRegistrations = async (req: Request, res: Response) => {
    try {
        // const { search }: { 
        //     search?: Record<string, unknown>,
        // } = req.query

        const searchFor = {
            event: req.params.eventId
        }

        const queryOptions = createQueryOptions(req.query)

        const items = await Registrations.find(createFilteredQuery(searchFor, req), undefined, queryOptions)
        res.status(200)
        res.json(items)
    } catch (e) {
        res.sendStatus(500)
        logger.error(e)
    }
}

export const createRegistration = async (req: Request, res: Response) => {
    try {
        const event = await Events.findById(req.params.eventId)
        if (!event) return res.sendStatus(404)

        if (event.maxRegistrations) {
            // check if there are already too many registrations
            const numRegistrations = await Registrations.countDocuments({ event: req.params.eventId })
            if (numRegistrations >= event.maxRegistrations) {
                res.status(400)
                res.statusMessage = 'Event is full'
                return res.send()
            }
        }

        const [volunteerCategory] = req.body.volunteerCategory.split(' - ')

        if (req.isAuthenticated()) {
            const nonCustomPaths = Object.keys(UserRegistration.schema.paths)
            const customFields: Map<string, any> = new Map()
            const userRegistration = new UserRegistration({
                ...req.body,
                volunteerCategory,
                event: req.params.eventId,
                user: req.user as IUser
            })

            Object.entries(req.body).forEach(([key, value]) => {
                if (nonCustomPaths.includes(key)) return
                customFields.set(key, value)
            })
            userRegistration.set('customFields', customFields)

            await userRegistration.save()
        } else {
            const nonCustomPaths = Object.keys(GuestRegistration.schema.paths)
            const customFields: Map<string, any> = new Map()
            const guestRegistration = new GuestRegistration({
                ...req.body,
                volunteerCategory,
                event: req.params.eventId
            })

            Object.entries(req.body).forEach(([key, value]) => {
                if (nonCustomPaths.includes(key)) return
                customFields.set(key, value)
            })
            guestRegistration.set('customFields', customFields)

            await guestRegistration.save()
        }
        res.status(201)
    } catch (e) {
        res.status(500)
        if (e instanceof Error) {
            res.statusMessage = e.message
        }
        logger.error(e)
    } finally {
        res.send()
    }
}

/**
 * @openapi
 * /events/{eventId}/register/{registrationId}:
 *  parameters:
 *      - in: path
 *        name: eventId
 *      - in: path
 *        name: registrationId
 *  patch:
 *      tags:
 *          - registrations
 *      operationId: updateRegistration
 *      summary: Update an event Registration
 *      description: Update an event registration
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      oneOf:
 *                      - $ref: '#/components/schemas/UserRegistration'
 *                      - $ref: '#/components/schemas/GuestRegistration'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/schemas/UserRegistration'
 *                              - $ref: '#/components/schemas/GuestRegistration'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 *  delete:
 *      tags:
 *          - registrations
 *      operationId: deleteRegistration
 *      summary: Delete a registration
 *      description: Delete an event registration
 *      responses:
 *          204:
 *              description: Success
 *          404: 
 *              description: Not Found
 *          default:
 *              description: An unknown error occurred
 */

export const updateRegistration = async (req: Request, res: Response) => {
    try {
        const item = await Registrations.findOne(createFilteredQuery({ _id: req.params.registrationId }, req))
        if (!item) return res.sendStatus(404)

        item.set(req.body)
        await item.save()

        res.json(item)
    } catch (e) {
        res.sendStatus(500)
        logger.error(e)
    }
}

export const deleteRegistration = async (req: Request, res: Response) => {
    try {
        const item = await Registrations.findOne(createFilteredQuery({ _id: req.params.registrationId }, req))
        if (!item) return res.sendStatus(404)

        await item?.delete()

        res.sendStatus(204)
    } catch (e) {
        res.sendStatus(500)
        logger.error(e)
    }
}
