import { Schema, model, Types } from 'mongoose'

export interface IEvents {
    _id: Types.ObjectId,
    name: string,
    description: string,
    category: string,
    address: string,
    location: {
        type: string
        coordinates: number[]
    },
    startTime: Date,
    endTime: Date,
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
 *              address:
 *                  type: string
 *                  example: '312 Walnut St. Cincinnati OH 45202'
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
    address: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    startTime: Date,
    endTime: Date,
}, { timestamps: true })

export const Events = model<IEvents>('Events', eventsSchema)
