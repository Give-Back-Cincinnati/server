import { Express, Router } from 'express'
import passport from 'passport'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import { logger, config } from '../../config'
import { Serialization } from "./serialization"

import Google from './Google/index'
import Local from './Local/index'

/**
 * @openapi
 * tags: 
 *  - name: auth
 *    description: authentication schemes
 * components:
 *      securitySchemes:
 *          cookieAuth:
 *              description: "**USE /auth/login TO LOGIN INSTEAD OF PUTTING ANYTHING HERE**"
 *              type: apiKey
 *              in: cookie
 *              name: connect.sid
 */
export const router = Router()

export function setupPassport (app: Express) {
	const RedisStore = connectRedis(session)

	const redisClient = createClient({
		url: config.redis.url,
		legacyMode: true
	})

	/* istanbul ignore else */
	if (config.node_env === 'test') {
		app.use(
			session({
				saveUninitialized: false,
				secret: config.redis.secret,
				resave: false
			})
		)
	} else {
		redisClient.connect().catch(logger.error)
		redisClient.on('error', logger.error)

		app.use(
			session({
				store: new RedisStore({ client: redisClient }),
				saveUninitialized: false,
				secret: config.redis.secret,
				resave: false,
				cookie: {
					maxAge: config.session_length
				}
			})
		)
	}

	passport.serializeUser(Serialization.serialize)
	passport.deserializeUser(Serialization.deserialize)

	app.use(passport.initialize())
	app.use(passport.session())
}

/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *      - auth
 *    operationId: login
 *    summary: Authenticate by email/password
 *    description: Authenticate by email/password
 *    responses:
 *      204:
 *          description: Success!
 *      401:
 *          description: Authentication Failed
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                      - password
 *                  properties:
 *                      email: 
 *                          type: string
 *                      password: 
 *                          type: string
 */
router.use('/login', Local)
/**
 * @openapi
 * /auth/google/callback:
 *  get:
 *    tags:
 *      - auth
 *    operationId: authGoogleCallback
 *    summary: Authenticate by Google authentication token
 *    description: Authenticate by Google authentication token
 *    responses:
 *      204:
 *          description: Success!
 *      401:
 *          description: Authentication Failed
 *    parameters:
 *      - in: query
 *        name: code
 *        description: Google issued authentication token
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: scope
 *        description: Google scopes desired
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: authuser
 *        description: Google auth-user array position
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: hd
 *        description: user email domain
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: prompt
 *        description: whether to prompt the user
 *        required: true
 *        schema:
 *          type: string
 */
router.use('/google', Google)

router.get('/logout', (req, res) => {
	req.logout()
	res.sendStatus(204)
})

export default router
