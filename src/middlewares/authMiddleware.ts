import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/index";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("🚀 ~ req.headers:", req.headers)
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payload = jwt.verify(token, "this_is_not_a_secret") as JwtPayload;
        req.user = payload;
        next();
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
    
}