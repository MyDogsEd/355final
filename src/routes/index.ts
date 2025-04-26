import auth from './Auth.routes'
import games from './Games.routes'
import comments from './Comments.routes'

import express, { Request, Response} from 'express';

const router = express.Router();

router.use(auth)
router.use(games)
router.use(comments)

router.use((req: Request, res: Response) => {
    res.status(404).render('404', {
        title: "404 - Page Not Found",
        logged_in: req.session.logged_in
    })
})

export default router;