import express from "express";
import { createUser, getAllUsers,login } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/users', authenticateUser as express.RequestHandler , getAllUsers as express.RequestHandler);

router.post('/users', authenticateUser as express.RequestHandler, createUser as express.RequestHandler);

router.post('/login', login as express.RequestHandler);

export default router;