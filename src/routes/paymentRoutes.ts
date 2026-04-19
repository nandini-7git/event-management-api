import { Router } from "express";
import { createIntent, confirmPayment } from "../controllers/paymentController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create-intent", authenticateJWT, createIntent);
router.post("/confirm", authenticateJWT, confirmPayment);

export default router;
