import { Request, Response } from "express";
import { bookTicket } from "./ticketController";

//Simulate Payment Intent (Stripe/PayPal)
export const createIntent = async (req: Request, res: Response) => {
  try {
    const { eventId, amount } = req.body;

    if (!eventId || !amount) {
      return res.status(400).json({ message: "eventId and amount are required" });
    }

    const paymentId = "SIM_PAY_" + Date.now();

    res.status(201).json({
      paymentId,
      amount,
      status: "requires_confirmation",
      message: "Payment intent created (simulation)"
    });
  } catch (err: any) {
    res.status(500).json({ message: "Error creating payment intent", error: err.message });
  }
};

//Confirm Payment + Auto-Book Ticket
export const confirmPayment = async (req: any, res: any) => {
  try {
    const { paymentId, provider, eventId, type } = req.body;

    if (!paymentId || !provider || !eventId || !type) {
      return res.status(400).json({ 
        message: "paymentId, provider, eventId, and type are all required" 
      });
    }

    console.log("Payment confirmed:", paymentId, provider);

    //Book ticket internally,including paymentId
    const ticket = await bookTicket(
      { ...req, body: { eventId, type, paymentId }, user: req.user },
      null,
      true
    );

    if (!ticket || ticket.error) {
      return res.status(500).json({ message: "Ticket booking failed", error: ticket?.error });
    }

    res.status(201).json({
      paymentId,
      provider,
      status: "confirmed",
      message: "Payment confirmed and ticket booked successfully",
      ticket
    });

  } catch (err: any) {
    res.status(500).json({ message: "Error confirming payment", error: err.message });
  }
};
