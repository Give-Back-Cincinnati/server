import { UploadService } from "./upload-service"

export type Services<T> =
    T extends "Upload" ? UploadService :
    never;

export const Services: Record<string, unknown> = {}

export function createServices () {
    Services.Upload = new UploadService()
}

export const useServices = <T extends string>(serviceName: T): Services<T> => {
    if (!Services[serviceName]) throw new Error(`No service available with key: ${serviceName}`)
    
    return Services[serviceName] as Services<T>
}

export default useServices