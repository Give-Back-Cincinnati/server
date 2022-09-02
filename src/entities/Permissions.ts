import { Schema, model, Types } from 'mongoose'

export interface IPermissions {
    _id: Types.ObjectId,
    name: string,
    group: string,
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Permissions:
 *          type: object
 *          required:
 *              - name
 *              - group
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *                  readonly: true
 *              name:
 *                  type: string
 *                  example: 'permissions.get'
 *              group: 
 *                  type: string
 *                  example: 'permissions'
 */
export const permissionsSchema = new Schema({
    name: String,
    group: String
}, { timestamps: true })

export const Permissions = model<IPermissions>('Permissions', permissionsSchema)
