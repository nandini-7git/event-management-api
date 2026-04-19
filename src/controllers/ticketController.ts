import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import Ticket from "../models/Ticket";
import Event from "../models/Event";
import User from "../models/User";
import { transporter } from "../config/mailer";

//Book Ticket(called internally)
export const bookTicket = async (req: any, res: any, internalCall = false) => {
  try {
    const { eventId, type, paymentId } = req.body;
    const userId = req.user?.id;

    if (!eventId || !type || !userId || !paymentId) {
      if (internalCall) return { error: "Missing required fields including paymentId" };
      return res.status(400).json({ message: "eventId, type, userId, and paymentId are required" });
    }

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      if (internalCall) return { error: "Event not found" };
      return res.status(404).json({ message: "Event not found" });
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(`ticket-${eventId}-${userId}-${Date.now()}`);

    // Create ticket in DB including paymentId
    const ticket = await Ticket.create({ eventId, userId, type, qrCode, paymentId });

    // Save QR code as PNG locally
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    const filename = `ticket-${ticket.id}.png`;
    const folderPath = path.join(__dirname, "../../tickets");
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, filename), base64Data, "base64");
    console.log(`QR code saved as tickets/${filename}`);

    // Send email with QR code
    const user = await User.findByPk(userId);
    if (user && user.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your ticket for ${event.title}`,
        html: `
          <h2>Ticket Confirmed!</h2>
          <p>Event: ${event.title}</p>
          <p>Type: ${type}</p>
          <p>Date: ${event.date}</p>
          <p>Location: ${event.location}</p>
          <p>Payment ID: ${paymentId}</p>
          <img src="${qrCode}" alt="QR Code" />
        `,
      });
      console.log(`Ticket email sent to ${user.email}`);
    }

    if (internalCall) return ticket;

    res.status(201).json({ message: "Ticket booked successfully", ticket });

  } catch (err: any) {
    if (internalCall) return { error: err.message };
    res.status(500).json({ message: "Error booking ticket", error: err.message });
  }
};

//Get all tickets for logged-in user
export const getMyTickets = async (req: any, res: any) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [Event],
    });
    res.status(200).json(tickets);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching tickets", error: err.message });
  }
};
