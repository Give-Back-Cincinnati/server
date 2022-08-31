import { Schema, model, Types } from 'mongoose'

export interface IRegistrations {
    _id: Types.ObjectId,
    event: Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: Date,
    hasAgreedToTerms: boolean,
    checkedIn: boolean
}

/**
 * @openapi
 * components:
 *  schemas:
 *      registrations:
 *          type: object
 *          required:
 *              - event
 *              - 
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              event:
 *                  type: string
 *                  example: '627afea4acf098768c92b785'
 *              email:
 *                  type: string
 *                  example: 'clark@dailyplanet.com'
 *                  pattern: '^.+\@.+\..{2,}$'
 */
export const registrationsSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Events' },
    firstName: String,
    lastName: String,
    email: { type: String, match: /^.+\@.+\..{2,}$/i },
    phone: String,
    dateOfBirth: Date,
    hasAgreedToTerms: Boolean,
    checkedIn: { type: Boolean, default: false }
}, { timestamps: true })



export const Registrations = model<IRegistrations>('Registrations', registrationsSchema)
