import { Schema, model, Types } from 'mongoose'

type ComponentProps<T> = T

export interface IExperience {
    component: string,
    props: ComponentProps<any>
}

export interface IDynamicPages {
    _id: Types.ObjectId,
    name: string,
    experience: string[]
}

/**
 * @openapi
 * components:
 *  schemas:
 *      DynamicPages:
 *          type: object
 *          required:
 *              - name
 *              - url
 *              - experience
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'DynamicPages'
 *              url:
 *                  type: string
 *                  example: '/fall-feast'
 *              experience:
 *                  type: string
 */
export const dynamicpagesSchema = new Schema({
    name: String,
    url: { type: String, unique: true },
    experience: String
}, { timestamps: true })

export const DynamicPages = model<IDynamicPages>('DynamicPages', dynamicpagesSchema)
