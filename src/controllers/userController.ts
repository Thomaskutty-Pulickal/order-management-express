import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../config/ormConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = new User();
        const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        user.name = name;
        user.email = email;
        user.password = bcrypt.hashSync(password, 10);
        await AppDataSource.getRepository(User).save(user);

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await AppDataSource.getRepository(User).find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        if (!bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, "this_is_not_a_secret", { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Error logging in" });
    }
};