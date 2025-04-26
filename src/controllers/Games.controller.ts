import { Request, Response } from 'express';


// HTML Routes
const getGameByID = (req: Request, res: Response) => {

}

const getEditGameByID = (req: Request, res: Response) => {
    res.render('editGame')
}

const getNewGame = (req: Request, res: Response) => {
    res.render('newGame')
}

const getGames = (req: Request, res: Response) => {
    res.render('games')
}

const games = {
    getGameByID,
    getEditGameByID,
    getNewGame,
    getGames
}

export default games; 