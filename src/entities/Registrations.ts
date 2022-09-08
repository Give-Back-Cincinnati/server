import { Schema, model, Types } from 'mongoose'
import { IUser } from './Users'

export interface IRegistrations {
    _id: Types.ObjectId,
    event: Types.ObjectId,
    phone: string,
    dateOfBirth: Date,
    hasAgreedToTerms: boolean,
    checkedIn: boolean,
}

export interface IUserRegistration extends IRegistrations {
    user: IUser | Types.ObjectId
}

export interface IGuestRegistration extends IRegistrations {
    firstName: string,
    lastName: string,
    email: string,
}

/**
 * @openapi
 * components:
 *  schemas:
 *      BasicRegistration:
 *          type: object
 *          required:
 *              - phone
 *              - dateOfBirth
 *              - hasAgreedToTerms
 *          properties:
 *              _id:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *                  readonly: true
 *              phone:
 *                  type: string
 *                  example: '513-555-1234'
 *              dateOfBirth:
 *                  type: string
 *                  format: date-time
 *              hasAgreedToTerms:
 *                  type: boolean
 *                  default: false
 *                  name: I have read and agree to the terms and conditions
 *              checkedIn:
 *                  type: boolean
 *                  default: false
 *                  readonly: true
 *      UserRegistration:
 *          allOf:
 *              - $ref: '#/components/schemas/BasicRegistration'
 *              - type: object
 *                required:
 *                  - hasAgreedToTerms
 *                properties:
 *                    user:
 *                      oneOf:
 *                        - $ref: '#/components/schemas/Users'
 *                        - type: string
 *      GuestRegistration:
 *          allOf:
 *              - type: object
 *                required:
 *                      - firstName
 *                      - lastName
 *                      - email
 *                      - phone
 *                      - dateOfBirth
 *                      - hasAgreedToTerms
 *                properties:
 *                      firstName:
 *                          type: string
 *                          example: 'Clark'
 *                      lastName:
 *                          type: string
 *                          example: 'Kent'
 *                      email:
 *                          type: string
 *                          example: 'clark@dailyplanet.com'
 *                          pattern: '^.+\@.+\..{2,}$'
 *              - $ref: '#/components/schemas/BasicRegistration'
 */

// Base schema for registrations
const registrationsSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true, index: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    hasAgreedToTerms: { type: Boolean, default: false },
    checkedIn: { type: Boolean, default: false }
}, { timestamps: true })

export const Registrations = model<IRegistrations>('Registrations', registrationsSchema)

// For users that are authenticated
export const userRegistrationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true }
})
export const UserRegistration = Registrations.discriminator<IUserRegistration>('UserRegistration', userRegistrationSchema)

// For guests to the site, e.g. someone who doesn't have an account
export const guestRegistrationSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, match: /^.+@.+\..{2,}$/i, lowercase: true, required: true },
})
export const GuestRegistration = Registrations.discriminator<IGuestRegistration>('GuestRegistration', guestRegistrationSchema)
