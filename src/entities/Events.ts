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
 *                  example: 'Back to School'
 *              description:
 *                  type: string
 *                  example: 'This is a longer description of an event...'
 *              category:
 *                  type: string
 *                  example: 'Hands On'
 *              startTime:
 *                  type: string
 *                  format: date-time
 *              endTime:
 *                  type: string
 *                  format: date-time
 */
export const eventsSchema = new Schema({
    name: String,
    description: String,
    category: String,
    startTime: Date,
    endTime: Date,
}, { timestamps: true })

export const Events = model<IEvents>('Events', eventsSchema)
