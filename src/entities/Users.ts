import { Schema, Model, model, Types } from 'mongoose'
import {IRoles, Roles} from "./Roles"
import bcrypt from "bcryptjs"
import config from "../config"

export interface IUser {
    _id: Types.ObjectId,
    firstName: string
    lastName: string,
    email: string,
    profilePicture?: string,
    googleId?: string,
    role: Types.ObjectId | IRoles,
    password?: string
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - role
 *              - email
 *          properties:
 *              _id:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *                  readonly: true
 *              firstName:
 *                  type: string
 *                  example: 'Clark'
 *              lastName:
 *                  type: string
 *                  example: 'Kent'
 *              email:
 *                  type: string
 *                  example: 'clark@dailyplanet.news'
 *                  pattern: '^.+\@.+\..{2,}$'
 *              profilePicture:
 *                  type: string
 *                  example: 'https://google.com/test.png'
 *              role:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *      UsersMe:
 *          description: User object returned from Users.findByIdWithPermissions
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *          properties:
 *              _id:
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              firstName:
 *                  type: string
 *                  example: 'Clark'
 *              lastName:
 *                  type: string
 *                  example: 'Kent'
 *              email:
 *                  type: string
 *                  example: 'clark@dailyplanet.news'
 *                  pattern: '^.+\@.+\..{2,}$'
 *              profilePicture:
 *                  type: string
 *                  example: 'https://google.com/test.png'
 *              role:
 *                  $ref: '#/components/schemas/RolesMe'
 */
export const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, lowercase: true, required: true },
    profilePicture: String,
    googleId: { type: String, select: false },
    role: { type: Schema.Types.ObjectId, ref: 'Roles' },
    password: { type: String, select: false },
}, { timestamps: true })

userSchema.pre('save', async function () {
    const role = await Roles.findOne({ name: 'USER' })
    if (!this.role && role) {
        this.role = role._id
    }
    if (!this.isModified('password') || !this.password) return
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds)
})

export interface UserModel extends Model<IUser> {
    authenticate (email: string, password: string): Promise<IUser | false>
    findByIdWithPermissionsAndFilters (_id: Types.ObjectId): Promise<IUser>
}

userSchema.statics.authenticate = async function authenticate (email: string, password: string): Promise<IUser | false> {
    const user = await this.findOne({ email }).select('+password')
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            user.password = '' // overwrite password to prevent exposing the hash
            return user
        }
    }
    return false
}

userSchema.statics.findByIdWithPermissionsAndFilters = function findAllBySessionId (_id: Types.ObjectId): Promise<IUser> {
    return this
        .findOne({ _id })
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        })
        .populate({
            path: 'role',
            populate: { path: 'filters' }
        })
}

export const Users = model<IUser, UserModel>('Users', userSchema)
