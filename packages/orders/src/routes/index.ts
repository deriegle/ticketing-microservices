import { Response, Request, Router } from "express";

const router = Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  res.send({ orders: [] });
});

export const indexOrdersRouter = router;
