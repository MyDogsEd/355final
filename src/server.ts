import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import connectSessionSequelize from 'connect-session-sequelize';

import sequelize from './config/database.config';
import usernameMiddleware from './middleware/Username.middleware'
import router from './routes';


// Do the dotenv stuffs
dotenv.config({path: path.join(__dirname, "../.env")})

// setup express
const app = express()
const port = process.env.PORT || 3000

// Sequelize store
const SequelizeStore = connectSessionSequelize(session.Store)

// Interface to merge types=
interface Session {
    logged_in: boolean

}

// check that the session secret is defined
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error("Session secret not defined!")
}

// Setup Sequelize Sessions
app.use(session({
    secret: sessionSecret,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // one day
    },
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    }) 
}))

// setup helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}))

// setup handlebars
app.engine('hbs', engine({ 
    layoutsDir: path.join(__dirname, '../src/views/layouts'),
    partialsDir: path.join(__dirname, '../src/views/partials'),
    defaultLayout: 'main',
    extname: 'hbs'
}))
app.set('views', path.join(__dirname, '../src/views'))
app.set('view engine', 'hbs')

// register middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, "../src/public"))) // static public folder
app.use(usernameMiddleware)

// use routes defined in ./routes
app.use(router)

sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
})
