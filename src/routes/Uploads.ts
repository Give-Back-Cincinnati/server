import { logger } from '../config/index'
import { Router, Response, Request } from 'express'
import { Uploads } from '../entities/Uploads'
import { userHasPermissions } from './auth/middleware'
import { createFilteredQuery, createQueryOptions } from '../entities/queryUtils'

import { config } from '../config'
import {
    S3Client,
    PutObjectCommand
} from '@aws-sdk/client-s3'

import {
    getSignedUrl
} from '@aws-sdk/s3-request-presigner'

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${config.cloudflare.account_id}.r2.cloudflarestorage.com`,
    credentials: config.s3.credentials
});

/**
 * @openapi
 * tags: 
 *  - name: uploads
 *    description: Uploads
 */
const router = Router()
/**
 * @openapi
 * /uploads:
 *  get:
 *    tags:
 *      - uploads
 *    operationId: searchUploads
 *    summary: Search Uploads records
 *    description: Get Uploads records
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
 *            enum: []
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
 *                      $ref: '#/components/schemas/Uploads'
 *  post:
 *    tags:
 *      - uploads
 *    operationId: createUploads
 *    summary: Create a Uploads record
 *    description: Create a new uploads record and receive a presigned url
 *    requestBody:
 *      content:
 *          application/json:
 *              schema: 
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                      mime-type:
 *                          type: string
 *                          enum: [image/png, image/jpeg, image/svg+xml]
 *    responses:
 *      201:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          uploadUrl:
 *                              type: string
 */
router.route('/')
    .get(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const { name }: {
                name?: string
            } = req.query

            const searchFor = {
                name
            }

            const queryOptions = createQueryOptions(req.query)

            const items = await Uploads.find(createFilteredQuery(searchFor, req), undefined, queryOptions)
            res.json(items)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .post(userHasPermissions(), async (req: Request, res: Response) => {
        // client mime-type implementation:
        // https://stackoverflow.com/a/29672957
        try {
            const item = new Uploads({
                name: req.body.name
            })

            const Key = `uploads/${item._id}.png`
            item.url =`https://static.givebackcincinnati.org//${Key}` // for some reason R2 adds an extra delimiter on folder

            const uploadUrl = await getSignedUrl(S3, new PutObjectCommand({
                Bucket: config.s3.bucket,
                Key
            }), { expiresIn: 3600 })
            await item.save()

            res.status(201).send({
                _id: item._id,
                uploadUrl
            })
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })

/**
 * @openapi
 * /uploads/{id}:
 *  parameters:
 *      - in: path
 *        name: id
 *  patch:
 *      tags:
 *          - uploads
 *      operationId: updateUploads
 *      summary: Update a single Uploads record
 *      description: Update a single Uploads record to be a live record, this is a one way operation
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Uploads'
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred 
 *  delete:
 *      tags:
 *          - uploads
 *      operationId: deleteUploads
 *      summary: Delete a Uploads record
 *      description: Delete a Uploads record
 *      responses:
 *          204:
 *              description: Success
 *          404:
 *              description: Item not found
 *          default:
 *              description: An unknown error occurred
 */
router.route('/:id')
    .patch(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await Uploads.findOne(createFilteredQuery({ _id: req.params.id }, req))
            if (!item) return res.sendStatus(404)

            item.set({ isLive: true })
            await item.save()

            res.json(item)
        } catch (e) {
            res.sendStatus(500)
            logger.error(e)
        }
    })
    .delete(userHasPermissions(), async (req: Request, res: Response) => {
        try {
            const item = await Uploads.deleteOne(createFilteredQuery({ _id: req.params.id }, req))
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
