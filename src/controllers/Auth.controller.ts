import { Request, Response } from 'express';
import { User } from '../models';

// HTML Routes

const getLogin = async (req: Request, res: Response)  => {
    
    res.render('login', {message: req.session.message})
    req.session.message = ""

}

const getSignup = async (req: Request, res: Response)  => {

    res.render('signup', {message: req.session.message})
    req.session.message = ""
    
}

// JSON ROUTES

// route for actually logging in
const postLogin = async (req: Request, res: Response) => {
    try {
        const userData = await User.findOne({ where: { username: req.body.username }})

        if (!userData) {
            // user not found
            req.session.message = 'Incorrect username or password, please try again'
            res.redirect('/login')
            return
        }

        const validPassword = userData?.checkPassword(req.body.password)

        if (!validPassword) {
            req.session.message = 'Incorrect username or password, please try again'
            res.redirect('/login')
            return
        }

        // log the user in
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        res.redirect('/games')

    } catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}

const postSignup = async (req: Request, res: Response) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            password: req.body.password
        })

        req.session.user_id = userData.id
        req.session.logged_in = true
        
        res.redirect('/games')
    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}

// route for logging out
const postLogout = async (req: Request, res: Response) => {
    try {
        req.session.destroy(() => {
            res.redirect('/')
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}

const auth = {
    getLogin,
    getSignup,
    postLogin,
    postLogout,
    postSignup
}

export default auth;
