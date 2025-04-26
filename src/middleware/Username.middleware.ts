import { NextFunction, Request, Response } from "express";
import { User } from "../models";

const usernameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.logged_in){
        res.locals.username = await User.findOne({where: {id: req.session.user_id}})
        res.locals.logged_in = req.session.logged_in
    }
    next() 
}

export default usernameMiddleware