import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/ormConfig";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/", userRoutes);

// Connect to the database
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => console.error("Database connection error:", error));

export default app;
