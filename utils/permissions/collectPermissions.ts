import fs from 'fs'
import path from 'path'
import { RouteInterface } from './permissionsUtilities'
import { HydratedDocument } from 'mongoose'
import { Permissions, IPermissions } from '../../src/entities/Permissions'


export async function collectPermissions (): Promise<HydratedDocument<IPermissions>[]> {    
    return new Promise((resolve, reject) => {
        fs.readdir('./src/routes/', async (err, files) => {
            const permissionsRoutes = files.filter((file: string) => (
                !file.includes('test') && !file.includes('auth') && file !== 'index.ts'
            ))
                
            const permissionsList: HydratedDocument<IPermissions>[] = []
            
            await Promise.all(permissionsRoutes.map(async module => {
                import(path.resolve(__dirname, `../../src/routes/${module}`))
                    .then(router => {
                        let moduleCommonName = module.replace('.ts', '').toLowerCase()
        
                        router.default.stack.forEach((layer: {
                            route: {
                                path: string,
                                stack: any[],
                                methods: RouteInterface
                            }
                        }) => {
                            const path = layer.route.path.slice(1).replace(/:/g, '').replace(/\//g, '.').toLowerCase()
                            Object.entries(layer.route.methods)
                                .filter(([method, bool]) => bool)
                                .forEach(([method]) => {
                                    permissionsList.push(new Permissions({
                                        name: `${moduleCommonName}.${path ? path + '.' : ''}${method}`,
                                        group: moduleCommonName
                                    }))
                                })
                        })
                    })
            }))

            resolve(permissionsList)
        })
    })
}

