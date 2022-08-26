import handleOauthCallback from "./handleOauthCallback"
import { Users } from '../../../entities/Users'
import { Profile } from 'passport-google-oauth20'

describe('Google/handleOauthCallback', function () {
    const mockCallback = jest.fn()
    const profile: Profile = {
        displayName: 'Google User',
        profileUrl: 'https://google.com',
        id: '0976543fghj',
        name: { givenName: 'Clark', familyName: 'Kent' },
        _raw: '',
        provider: 'google',
        _json: {
            iss: 'string',
            aud: 'string',
            sub: 'string',
            iat: 67812,
            exp: 68999,
        }
    }
    const altID = '9875632asdasfadsf'

    beforeEach(async () => {
        jest.clearAllMocks()
    })

    it('calls callback', async () => {
        await handleOauthCallback('access', 'refresh', profile, mockCallback)

        expect(mockCallback).toHaveBeenCalled()
    })

    it('inserts a user if they don\'t already exist', async () => {
        await handleOauthCallback('access', 'refresh', profile, mockCallback)

        const foundUser = await Users.findOne({ googleId: profile.id }).select('+googleId')

        expect(foundUser).not.toBeNull()
        expect(foundUser?.googleId).toEqual(profile.id)
        expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
            firstName: foundUser?.firstName,
            lastName: foundUser?.lastName,
            _id: foundUser?._id
        }))
    })

    it('inserts a user if they don\'t have a name object', async () => {

        await handleOauthCallback('access', 'refresh', { ...profile, id: altID, name: undefined }, mockCallback)

        const foundUser = await Users.findOne({ googleId: altID })

        expect(foundUser).not.toBeNull()
        expect(foundUser).toHaveProperty('firstName', undefined)
        expect(foundUser).toHaveProperty('lastName', undefined)
        expect(mockCallback).toHaveBeenCalledWith(null, foundUser)
    })

    it('calls callback with an error if input is wrong', async () => {
        await handleOauthCallback('access', 'refresh', {...profile, id: {}} as unknown as Profile, mockCallback)

        expect(mockCallback).toHaveBeenCalledWith(expect.any(Error))
    })

})
