import { Schema, model, Types } from 'mongoose'
import { IUser } from './Users'

export interface IRegistrations {
    _id: Types.ObjectId,
    event: Types.ObjectId,
    phone: string,
    dateOfBirth: Date,
    hasAgreedToTerms: boolean,
    checkedIn: boolean,
    eContactName?: string,
    eContactPhone?: string,
    customFields: Map<string, string>
    volunteerCategory: string
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
 *      EmergencyContact:
 *          type: object
 *          required:
 *            - eContactName
 *            - eContactPhone
 *          properties:
 *             eContactName:
 *               type: string
 *               example: 'Lois Lane'
 *               name: Emergency Contact Name
 *             eContactPhone:
 *               type: string
 *               example: '513-555-1234'
 *               name: Emergency Contact Phone
 *      BasicRegistration:
 *          type: object
 *          required:
 *                - phone
 *                - dateOfBirth
 *                - hasAgreedToTerms
 *                - volunteerCategory
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
 *                  format: date
 *              volunteerCategory:
 *                  type: string
 *              checkedIn:
 *                  type: boolean
 *                  default: false
 *                  readonly: true
 *              customFields:
 *                  type: object
 *                  additionalProperties: true
 *                  readonly: true
 *              hasAgreedToTerms:
 *                  type: boolean
 *                  default: false
 *                  name: I have read and agree to the terms and conditions
 *      UserRegistration:
 *          allOf:
 *              - $ref: '#/components/schemas/BasicRegistration'
 *              - $ref: '#/components/schemas/EmergencyContact'
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
 *                      firstEvent:
 *                          type: boolean
 *                          default: false
 *                          name: Is this your first event with us?
 *              - $ref: '#/components/schemas/BasicRegistration'
 *              - $ref: '#/components/schemas/EmergencyContact'
 */

// Base schema for registrations
const registrationsSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Events', required: true, index: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    hasAgreedToTerms: { type: Boolean, default: false },
    checkedIn: { type: Boolean, default: false },
    eContactName: { type: String, default: '' }, // default is set for legacy registrations, required is NOT set here to allow legacy checkins
    eContactPhone: { type: String, default: '' }, // default is set for legacy registrations, required is NOT set here to allow legacy checkins
    customFields: { type: Map, of: String, default: {} },
    volunteerCategory: { type: String, default: '' }
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
    firstEvent: { type: Boolean, default: false },
    email: { type: String, match: /^.+@.+\..{2,}$/i, lowercase: true, required: true },
})
export const GuestRegistration = Registrations.discriminator<IGuestRegistration>('GuestRegistration', guestRegistrationSchema)
