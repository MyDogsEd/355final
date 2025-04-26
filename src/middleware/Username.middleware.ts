import { NextFunction, Request, Response } from "express";
import { User } from "../models";

const usernameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.logged_in){
        const user = await User.findOne({where: {id: req.session.user_id}})
        res.locals.username = user?.username
        res.locals.logged_in = req.session.logged_in
    }
    next() 
}

export default usernameMiddleware