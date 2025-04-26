import { Router } from "express";
import controllers from '../controllers'
import withAuth from "../middleware/Auth.middleware";

const router = Router()

// HTML Routes
router.get('/login', controllers.auth.getLogin)
router.get('/signup', controllers.auth.getSignup)

// JSON Route for authentication
router.post('/auth/login', controllers.auth.postLogin)
router.post('/auth/logout', withAuth, controllers.auth.postLogout)
router.post('/auth/signup', controllers.auth.postSignup)

export default router;