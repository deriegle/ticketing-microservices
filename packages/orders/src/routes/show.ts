import { Response, Request, Router } from "express";

const router = Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send({ order: [] });
});

export const showOrderRouter = router;
