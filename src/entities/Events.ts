import { Schema, model, Types } from 'mongoose'
import { nanoid } from 'nanoid'
import { IRegistrations, Registrations } from './Registrations'

export interface IEvents {
    _id: Types.ObjectId,
    name: string,
    slug: string,
    description: string,
    category: string,
    address: string,
    location: {
        type: string
        coordinates: number[]
    },
    startTime: Date,
    endTime: Date,
    maxRegistrations?: number,
    customFields: Map<string, {
        type: string,
        enum?: string[],
        name?: string,
        isRequired?: boolean
    }>
    volunteerCategories: Map<string, { capacity: number, name: string, shift: string }>
    isFull?: boolean
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
 *              - slug
 *              - description
 *              - category
 *              - address
 *              - startTime
 *              - endTime
 *          properties:
 *              _id:
 *                  type: string
 *                  readonly: true
 *              slug:
 *                  type: string
 *                  readonly: true
 *              name:
 *                  type: string
 *                  example: 'Back to School'
 *              description:
 *                  type: string
 *                  example: 'This is a longer description of an event...'
 *                  maxLength: 2000
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
 *              maxRegistrations:
 *                  type: number
 *              volunteerCategories:
 *                  type: object
 *                  additionalProperties:
 *                      type: object
 *                      properties:
 *                         type:
 *                            type: string
 *                            enum: ['object']
 *                            readonly: true
 *                         capacity:
 *                            type: number
 *                         name:
 *                            type: string
 *                         shift:
 *                            type: string
 *              customFields:
 *                  type: object
 *                  additionalProperties: 
 *                     type: object
 *                     properties:
 *                          type:
 *                              type: string
 *                              enum: ['string']
 *                          name:
 *                              type: string
 *                          isRequired:
 *                             type: boolean
 *                          enum:
 *                             type: array
 *                             items:
 *                                type: string
 */
export const eventsSchema = new Schema({
    name: { type: String, required: true },
    slug: {
        type: String,
        unique: true,
        immutable: true
    },
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
    maxRegistrations: Number,
    volunteerCategories: {
        type: Map,
        of: {
            type: { type: String, enum: ['object'], default: 'object' },
            properties: {
                name: { type: String, required: true },
                capacity: { type: Number, default: 0 },
                shift: { Type: String, default: '' }
            }
        },
        default: new Map()
    },
    customFields: {
        type: Map,
        of: {
            type: { type: String, enum: ['string', 'enum'] },
            enum: [String],
            isRequired: { type: Boolean, default: false },
        },
        default: new Map()
    }
}, { timestamps: true })

eventsSchema.pre('save', async function () {
    // generate a slug if one does not exist
    if (this.name && !this.slug) {
        this.slug = encodeURIComponent(this.name
            .toLowerCase()
            .replace(/\W+/g, '-')
        ) + '-' + new Date().getFullYear().toString()
        // ensure slug is unique on first save, if not unique: add unique string to the end of the slugs
        const slugExistsEntity = await Events.findOne({ slug: this.slug })
        if (slugExistsEntity) {
            this.slug += nanoid(3)
        }
    }
})

eventsSchema.post("findOne", async function (doc?: IEvents) {
    if (!doc) return
    const registrations = await Registrations.find({ event: doc })

    if (doc.maxRegistrations && registrations.length >= doc.maxRegistrations) {
        doc.isFull = true
        return
    }
    const regCounts = registrations.reduce((acc: Record<string, number>, curr) => {
        acc[(curr as IRegistrations)['volunteerCategory']] ??= 0
        acc[(curr as IRegistrations)['volunteerCategory']] += 1
        return acc
    }, {})

    if (doc.volunteerCategories) {
        Array.from(doc.volunteerCategories.entries()).forEach(([key, category]) => {
            if (category.capacity !== 0 && category.capacity <= regCounts[category.name]) {
                if (!doc) return
                doc.volunteerCategories.delete(key)
            }
        })
    }
})

export const Events = model<IEvents>('Events', eventsSchema)
