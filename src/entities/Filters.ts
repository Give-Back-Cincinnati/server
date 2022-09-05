import { Schema, model, Types } from 'mongoose'

export interface IFilters {
    _id: Types.ObjectId,
    name: string,
    filter: Record<string, unknown>
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Filters:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *                  readonly: true
 *              name:
 *                  type: string
 *                  example: 'Filters'
 */
export const filtersSchema = new Schema({
    name: { type: String, lowercase: true },
    filter: Object
}, { timestamps: true })

filtersSchema.pre('save', function () {
    if (this.name) {
        this.name = this.name.toLowerCase()
    }
})

export const Filters = model<IFilters>('Filters', filtersSchema)
