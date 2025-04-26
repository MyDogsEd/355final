import { Router, Request, Response } from "express";

import controllers from '../controllers'
import withAuth from "../middleware/Auth.middleware";

const router = Router()

// comment crud routes
router.post('/games/:gameId/comments/new', withAuth, controllers.comments.newComment)
router.post('/games/:gameId/comments/:commentId', withAuth, controllers.comments.editComment)

// deleting w/ a post request for html forms
router.post('/games/:gameId/comments/:commentId/delete', withAuth, controllers.comments.deleteComment)

export default router