import express from "express";
import { AppDataSource } from "../config/ormConfig";
import { Product } from "../entities/Product";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Get all products
router.get("/", authenticateUser as express.RequestHandler, async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const min = minPrice ? parseFloat(minPrice as string) : 0;
    const max = maxPrice ? parseFloat(maxPrice as string) : Number.MAX_VALUE;

    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository
      .createQueryBuilder("product")
      .where("product.price >= :min", { min })
      .andWhere("product.price <= :max", { max })
      .getMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Create a new product
router.post("/", authenticateUser as express.RequestHandler, async (req, res) => {
  const { name, price, description } = req.body;
  const productRepository = AppDataSource.getRepository(Product);

  const product = productRepository.create({ name, price, description });
  await productRepository.save(product);
  res.status(201).json(product);
});

export default router;
