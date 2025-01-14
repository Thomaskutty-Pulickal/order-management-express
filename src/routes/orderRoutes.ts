import express from "express";
import { getOrders, createOrder } from "../controllers/orderController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser as express.RequestHandler, getOrders);

router.post("/", authenticateUser as express.RequestHandler, createOrder as express.RequestHandler);

export default router;
