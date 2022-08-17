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
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
}, { timestamps: true })

export const Events = model<IEvents>('Events', eventsSchema)
