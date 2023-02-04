/* istanbul ignore file */
// import pino from 'pino'

// parse MONGO url fields from process.env during tests
if (process.env.MONGO_URL) {
    const uri = process.env.MONGO_URL
    process.env.MONGODB_PROTOCOL = uri.slice(0, uri.indexOf('://'))
    process.env.MONGODB_HOST = uri.slice(uri.indexOf('://') + 3, uri.indexOf('/', uri.indexOf('://') + 3))
}

function determineDefaultPort() {
    switch(process.env.NODE_ENV) {
        case 'test':
            // Randomly chosen port to ensure no conflicts,
            //      especially when running tests locally and developing client too
            return 31526
        default:
            return process.env.PORT || 3000
    }
}

export const config = {
    port: determineDefaultPort(),
    node_env: process.env.NODE_ENV,
    npm_package_version: process.env.npm_package_version || '0.0.0',
    npm_package_name: process.env.npm_package_name || 'API',
    session_length: parseInt(process.env.COOKIE_MAX_AGE || (1000 * 60 * 60 * 7).toString()), // defaults to 1 week sessions
    cors: {
        origin: new RegExp(process.env.CORS_ORIGIN || /https?:\/\/localhost:\d{1,4}/),
        credentials: true,
    },
    mongo: {
        // include auth in the mongodb_uri env var
        protocol: process.env.MONGODB_PROTOCOL || 'mongodb',
        host: process.env.MONGODB_HOST || 'mongo',
        username: process.env.MONGODB_USER || undefined,
        password: process.env.MONGODB_PASSWORD || undefined,
        database: process.env.MONGODB_DATABASE || 'index',
        options: {
          readPreference: 'primary',
        },
      },
    redis: {
        url: process.env.REDIS_URL || 'redis://redis:6379',
        secret: process.env.REDIS_SECRET || 'secret'
    },
    google_oauth: {
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || 'this_is_a_client_id',
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || 'this_is_a_client_secret'
    },
    bcrypt: {
        saltRounds: parseInt(process.env.SALT_ROUNDS || "1") // recommend 13 in production
    },
    cloudflare: {
        account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
    },
    s3: {
        baseUrl: 'https://static.givebackcincinnati.org/',
        bucket: 'gbc-static',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
        }
    }
}

export const logger = console


export default config
