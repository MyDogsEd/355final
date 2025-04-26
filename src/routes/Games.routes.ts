import { Router, Request, Response } from "express";

import controllers from '../controllers'
import withAuth from "../middleware/Auth.middleware";

const router = Router()

// HTML Routes
router.get('/', (req: Request, res: Response) => res.redirect('/games'))
router.get('/games/new', withAuth, controllers.games.getNewGame)
router.get('/games/:id/edit', withAuth, controllers.games.getEditGameByID)
router.get('/games/:id', withAuth, controllers.games.getGameByID)
router.get('/games', withAuth, controllers.games.getGames)

export default router;