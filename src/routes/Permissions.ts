import { logger } from '../config/index'
    import { Router, Response, Request } from 'express'
    import { Permissions } from '../entities/Permissions'
    
    const router = Router()
    
    router.route('/')
        .get(async (req: Request, res: Response) => {
            const items = await Permissions.find({})
            res.json(items)
        })
        .post(async (req: Request, res: Response) => {
            const item = new Permissions(req.body)
            await item.save()
            res.status(201).json(item)
        })
    
    router.route('/:id')
        .get(async (req: Request, res: Response) => {
            try {
                const item = await Permissions.findOne({ _id: req.params.id })
                if (item) {
                    res.json(item)
                    return
                }
                res.sendStatus(404)
            } catch (e) {
                res.sendStatus(500)
                logger.error(e)
            }
        })
        .patch(async (req: Request, res: Response) => {
            try {
                const item = await Permissions.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
                if (item) {
                    res.json(item)
                    return
                }
                res.sendStatus(404)
            } catch (e) {
                res.sendStatus(500)
                logger.error(e)
            }
        })
        .delete(async (req: Request, res: Response) => {
            try {
                const item = await Permissions.deleteOne({ _id: req.params.id })
                if (item.deletedCount === 1) {
                    res.sendStatus(204)
                    return
                }
                res.sendStatus(404)
            } catch (e) {
                res.sendStatus(500)
                logger.error(e)
            }
        })
    
    export default router