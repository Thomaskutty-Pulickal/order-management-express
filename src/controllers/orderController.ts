import { Request, Response } from "express";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { AppDataSource } from "../config/ormConfig";
import { Product } from "../entities/Product";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order Items cannot be empty" });
    }

    const order = new Order();
    const orderItems: OrderItem[] = [];
    let totalPrice = 0;

    for (const item of items) {
      const orderItem = new OrderItem();
      const product = await AppDataSource.getRepository(Product).findOne({
        where: { id: item.productId },
    });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with id ${item.productId} not found` });
      }

      orderItem.product = product;
      orderItem.quantity = item.quantity;

      totalPrice += product.price * item.quantity;

      orderItems.push(orderItem);
    }

    order.orderItems = orderItems;
    order.totalPrice = totalPrice;
    await AppDataSource.getRepository(Order).save(order);

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};

/**
 * Fetches all orders from the database.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The response to send back to the client.
 * @returns {Promise<void>} - A promise that resolves when the request has been handled.
 */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const orders = await orderRepository.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
