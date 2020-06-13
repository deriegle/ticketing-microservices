import { Response, Request, Router } from "express";

const router = Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send({});
});

export const deleteOrderRouter = router;
