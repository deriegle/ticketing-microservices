import { Response, Request, Router } from "express";
import { requireAuth } from "@ticketing/backend-core";
import { Order } from "../models/order";

const router = Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser?.userId,
  }).populate("ticket");

  res.send({ orders });
});

export const indexOrdersRouter = router;
