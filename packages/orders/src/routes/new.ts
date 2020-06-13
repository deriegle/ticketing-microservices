import { Response, Request, Router } from "express";

const router = Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  res.send({ order: [] });
});

export const newOrderRouter = router;
