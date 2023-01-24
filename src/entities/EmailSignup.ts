import { Schema, model, Types } from 'mongoose'

export interface IEmailSignup {
    _id: Types.ObjectId,
    name: string
}

/**
 * @openapi
 * components:
 *  schemas:
 *      EmailSignup:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'EmailSignup'
 */
export const emailsignupSchema = new Schema({
    name: String
}, { timestamps: true })

export const EmailSignup = model<IEmailSignup>('EmailSignup', emailsignupSchema)
