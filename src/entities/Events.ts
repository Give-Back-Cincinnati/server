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
 *      EventCategories:
 *          type: string
 *          enum: ['Hands-On', 'Social', 'Interactive', 'Civic Engagement', 'New Member', 'Cincy YP', 'Leadership', 'Fall Feast', 'Paint the Town', 'Give Back Beyond Cincinnati']
 *      Events:
 *          type: object
 *          required:
 *              - name
 *              - description
 *              - category
 *              - address
 *              - startTime
 *              - endTime
 *          properties:
 *              _id:
 *                  type: string
 *                  readonly: true
 *              name:
 *                  type: string
 *                  example: 'Back to School'
 *              description:
 *                  type: string
 *                  example: 'This is a longer description of an event...'
 *                  maxLength: 1000
 *              category:
 *                  schema:
 *                      $ref: '#/components/schemas/EventCategories'
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
    category: { type: String, required: true, enum: ['Hands-On', 'Social', 'Interactive', 'Civic Engagement', 'New Member', 'Cincy YP', 'Leadership', 'Fall Feast', 'Paint the Town', 'Give Back Beyond Cincinnati'] },
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
