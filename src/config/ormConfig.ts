import { DataSource } from "typeorm";

import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "oms",
  synchronize: true, // Set to false in production
  logging: true,
  entities: [Product, Order, OrderItem, User],
});
