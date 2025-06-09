import { Express } from 'express'
import helmet from 'helmet'

export function applySecurityHeaders(app: Express) {
    app.use(helmet())

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
                styleSrc: ["'self'", "'unsafe-inline'", "https:"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "wss:", "https:"],
                frameAncestors: ["'none'"], // Mencegah clickjacking
            }
        })
    )
    app.use(helmet.referrerPolicy({
        policy: 'strict-origin-when-cross-origin'
    }))

    app.use(
        helmet.permittedCrossDomainPolicies({
            permittedPolicies: 'none'
        })
    )
}