import { Router, Request, Response } from "express";
import { validateRequest, requireAuth } from "@ticketing/backend-core";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").trim().not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { title, price } = req.body;

    return res.status(201).send({
      ticket: {
        id: "1234",
        title,
        price,
      },
    });
  }
);

export const createTicketRouter = router;
