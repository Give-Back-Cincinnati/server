import { Schema, model, Types } from 'mongoose'

export interface IUploads {
    _id: Types.ObjectId,
    name: string,
    url: string,
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Uploads:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'Uploads'
 *              url:
 *                  type: string
 *                  example: 'https://google.com/this/is/an/image.png'
 */
export const uploadsSchema = new Schema({
    name: String,
    url: String
}, { timestamps: true })

export const Uploads = model<IUploads>('Uploads', uploadsSchema)
