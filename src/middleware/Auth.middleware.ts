import { Request, Response, NextFunction } from "express";

const withAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.logged_in) {
        req.session.message = "You must be logged in to do that."
        res.redirect('/login')
    } else {
        next();
    }
}

export default withAuth