import { Request, Response } from "express"
import { User, Game, Comment } from "../models"

const newComment = async (req: Request, res: Response) => {
    try {
        // get the current game
        const game = await Game.findOne({where : {id: req.params.gameId}})

        if (!game) {
            res.sendStatus(404)
            return
        }

        // ensure that this game is the user's game
        if(!((await game.getUser()).id === req.session.user_id)){
            res.sendStatus(403) // send forbidden if not allowed
        }

        // create a new comment on the game object
        await game.createComment({
            title: req.body.title,
            date: req.body.date,
            content: req.body.content
        })

        // now that the comment has been created, redirect the user to the game page
        res.redirect(`/games/${game.id}`)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const editComment = async (req: Request, res: Response) => {

    try {
        // get the current game
        const game = await Game.findOne({where : {id: req.params.gameId}})

        if (!game) {
            res.sendStatus(404)
            return
        }

        // ensure that this game is the user's game
        if(!((await game.getUser()).id === req.session.user_id)){
            res.sendStatus(403) // send forbidden if not allowed
        }

        // get the comment
        const comments = await game.getComments({where: {id: req.params.commentId}})

        if(!comments) {
            res.sendStatus(404)
        }
        
        const comment = comments[0]

        await comment.update({
            title: req.body.title,
            date: req.body.date,
            content: req.body.content
        })

        // now that the comment has been updated, redirect the user to the game page
        res.redirect(`/games/${game.id}`)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }

}

const deleteComment = async (req: Request, res: Response) => {
    try {
        // get the current game
        const game = await Game.findOne({where : {id: req.params.gameId}})

        if (!game) {
            res.sendStatus(404)
            return
        }

        // ensure that this game is the user's game
        if(!((await game.getUser()).id === req.session.user_id)){
            res.sendStatus(403) // send forbidden if not allowed
        }

        // get the comment
        const comments = await game.getComments({where: {id: req.params.commentId}})

        if(!comments) {
            res.sendStatus(404)
        }
        
        const comment = comments[0]

        await comment.destroy()

        // now that the comment has been deleted, redirect the user to the game page
        res.redirect(`/games/${game.id}`)

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const comments = {
    newComment,
    editComment,
    deleteComment
}

export default comments