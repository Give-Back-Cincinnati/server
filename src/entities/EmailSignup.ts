/**
 * @openapi
 * components:
 *  schemas:
 *      EmailSignup:
 *          type: object
 *          required:
 *              - FNAME
 *              - LNAME
 *              - EMAIL
 *              - MMERGE5
 *          properties:
 *              FNAME:
 *                  type: string
 *                  example: 'Clark'
 *                  name: 'First Name'
 *              LNAME:
 *                  type: string
 *                  example: 'Kent'
 *                  name: 'Last Name'
 *              EMAIL:
 *                  type: string
 *                  example: 'clark@dailyplanet.news'
 *                  pattern: '^.+\@.+\..{2,}$'
 *                  name: 'Email'
 *              MMERGE5:
 *                  type: string
 *                  example: 'P&G'
 *                  name: Company
 */
