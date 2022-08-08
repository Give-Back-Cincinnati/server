import { Schema, model, Types } from 'mongoose'

export interface IEvents {
    _id: Types.ObjectId,
    name: string
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Events:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'Events'
 */
export const eventsSchema = new Schema({
    name: String
}, { timestamps: true })

export const Events = model<IEvents>('Events', eventsSchema)
