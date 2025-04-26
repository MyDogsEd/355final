import { Request, Response } from "express";
import { Game, User } from "../models";

// HTML Routes
const getGameByID = async (req: Request, res: Response) => {
    try {
        const gameData = await Game.findOne({ where: { id: req.params.id } });

        if (!gameData) {
            res.render("404");
        }

        if (!((await gameData?.getUser())?.id == req.session.user_id)) {
            res.status(403).render("404");
        }

        //console.log(JSON.stringify(await gameData?.getComments()))

        res.render("viewGame", {
            name: gameData?.name,
            datePurchased: gameData?.formatDatePurchased(),
            willPlayDate: gameData?.formatWillPlayDate(),
            comments: JSON.parse(JSON.stringify(await gameData?.getComments())),
            id: gameData?.id,
            notes: gameData?.notes
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const getEditGameByID = async (req: Request, res: Response) => {

    // get the game from the url
    const gameData = await Game.findOne({ where: { id: req.params.id } });

    if (!gameData) {
        res.render("404");
    }

    // if the user doesn't have access to that game, render a 404
    if (!((await gameData?.getUser())?.id == req.session.user_id)) {
        res.status(403).render("404");
    }


    res.render("editGame", {
        name: gameData?.name,
        datePurchased: gameData?.formatDatePurchased(),
        willPlayDate: gameData?.formatWillPlayDate(),
        notes: gameData?.notes,
        id: gameData?.id
    });
};

const getNewGame = (req: Request, res: Response) => {
    res.render("newGame");
};

const getGames = async (req: Request, res: Response) => {
    try {
        // get the logged in user
        const user = await User.findOne({ where: { id: req.session.user_id } });

        // get the games from that user
        const games = await user?.getGames();
        
        // convert the games object to a plain javascript object
        // because otherwise handlebars refuses to allow the property access
        res.render("games", {games: JSON.parse(JSON.stringify(games))});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

// crud routes

// create new entry
const newGame = async (req: Request, res: Response) => {
    // create a new game or error out
    try {
        const userData = await User.findOne({
            where: { id: req.session.user_id },
        });
        const gameData = await userData?.createGame({
            name: req.body.name,
            datePurchased: req.body.datePurchased,
            willPlayDate: req.body.willPlayDate,
            notes: req.body.notes,
        });
        res.redirect(`/games/${gameData?.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

// edit existing entry
const editGame = async (req: Request, res: Response) => {
    try {
        const gameData = await Game.findOne({ where: { id: req.params.id } });

        if (!gameData) {
            res.status(404).json({ message: "That game does not exist." });
        }

        if (!((await gameData?.getUser())?.id == req.session.user_id)) {
            res.status(403).json({
                message: "You do not have access to that game.",
            });
        }

        await gameData?.update({
            name: req.body.name,
            datePurchased: req.body.datePurchased,
            willPlayDate: req.body.willPlayDate,
            notes: req.body.notes,
        });

        res.redirect(`/games/${gameData?.id}`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

// delete existing entry
const deleteGame = async (req: Request, res: Response) => {
    try {
        const gameData = await Game.findOne({ where: { id: req.params.id } });

        if (!gameData) {
            res.status(404).json({ message: "That game does not exist." });
        }

        if (!((await gameData?.getUser())?.id == req.session.user_id)) {
            res.status(403).json({
                message: "You do not have access to that game.",
            });
        }

        await gameData?.destroy();

        res.redirect("/games");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const games = {
    getGameByID,
    getEditGameByID,
    getNewGame,
    getGames,

    // crud controllers
    newGame,
    editGame,
    deleteGame
};

export default games;
