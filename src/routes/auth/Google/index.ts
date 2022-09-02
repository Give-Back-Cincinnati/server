import { Router } from 'express'
import passport from 'passport'
import {Strategy} from 'passport-google-oauth20'
import { config } from '../../../config'
import handleOauthCallback from "./handleOauthCallback"

export const router = Router()

passport.use(new Strategy(
    {
        clientID: config.google_oauth.client_id,
        clientSecret: config.google_oauth.client_secret,
        callbackURL: "/auth/google/callback",
    },
    handleOauthCallback
))

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

/* istanbul ignore next */
router.get('/callback',
    (req, res, next) => {
        const googleStrategy = new Strategy(
            {
                clientID: config.google_oauth.client_id,
                clientSecret: config.google_oauth.client_secret,
                callbackURL: `${req.headers.origin}/auth/google/callback`,
            },
            handleOauthCallback
        )
        passport.authenticate(googleStrategy)(req, res, next)
    },
    (req, res) => {
        res.sendStatus(204)
    })

export default router
