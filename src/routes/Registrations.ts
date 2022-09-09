import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Registrations } from '../entities/Registrations'
import { userHasPermissions } from './auth/middleware'

/**
 * @openapi
 * tags: 
 *  - name: registrations
 *    description: Registrations
 */
const router = Router()
/**
 * @openapi
 * /registrations:
 *  get:
 *    tags:
 *      - registrations
 *    operationId: searchRegistrations
 *    summary: Search Registrations records
 *    description: Get Registrations records
 *    responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      required:
 *                          - _id
 *                          - numRegistrations
 *                      properties:
 *                          _id:
 *                              type: string
 *                          numRegistrations:
 *                              type: number
 */
router.route('/')
    .get(userHasPermissions('public'), async (req: Request, res: Response) => {
        try {
            const items = await Registrations.aggregate([
                {
                    $group: {
                        _id: "$event",
                        numRegistrations: {
                            $count: {}
                        }
                      }
                }
            ])

            res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

export default router
