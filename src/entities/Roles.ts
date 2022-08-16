import { Schema, model, Types } from 'mongoose'
import { IPermissions } from "./Permissions"
import { IFilters } from './Filters'

export interface IRoles {
    _id: Types.ObjectId,
    name: string,
    permissions:  IPermissions[],
    filters: IFilters[],
}

/**
 * @openapi
 * components:
 *  schemas:
 *      Roles:
 *          type: object
 *          required:
 *              - name
 *              - permissions
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'permissions.get'
 *              permissions: 
 *                  type: array
 *                  items: 
 *                      type: string
 *                      example: '627afea4acf098768c92b855'
 *              filters: 
 *                  type: array
 *                  items: 
 *                      type: string
 *                      example: '627afea4acf098768c92b855'
 *      RolesMe:
 *          description: Role object returned from Users.findByIdWithPermissionsAndFilters
 *          type: object
 *          required:
 *              - name
 *              - permissions
 *          properties:
 *              _id: 
 *                  type: string
 *                  example: '627afea4acf098768c92b855'
 *              name:
 *                  type: string
 *                  example: 'permissions.get'
 *              permissions: 
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/Permissions'
 *              filters: 
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/Filters'
 */
export const rolesSchema = new Schema({
    name: String,
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permissions'} ],
    filters: [{ type: Schema.Types.ObjectId, ref: 'Filters' } ],
}, { timestamps: true })

rolesSchema.pre('save', function () {
    if (!this.isModified('name')) return
    if (this.name) {
        this.name = this.name.toUpperCase()
    }
})

export const Roles = model<IRoles>('Roles', rolesSchema)
