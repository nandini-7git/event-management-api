import express from "express";
import { bookTicket, getMyTickets } from "../controllers/ticketController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = express.Router();

//Book a ticket 
router.post("/", authenticateJWT, (req, res) => bookTicket(req, res));

//Get tickets for logged-in user 
router.get("/my-tickets", authenticateJWT, getMyTickets);

export default router;
