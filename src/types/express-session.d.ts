// Declaration file for declaration merging for req.session

import 'express-session'

declare module 'express-session' {
    interface SessionData {
        logged_in: boolean
        user_id: number
        message: string
    }
}