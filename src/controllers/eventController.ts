import { Request, Response } from "express";
import Event from "../models/Event";

//Create Event
export const createEvent = async (req: Request, res: Response) => {
  try {
    //Log the request body to ensure all fields are coming
    console.log("Request body:", req.body);

    //Destructure fields to ensure required fields exist
    const { title, description, date, location, capacity } = req.body;

    if (!title || !description || !date || !location || capacity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
    });

    res.status(201).json({ message: "Event created", event });
  } catch (err: any) {
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
};

//Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
};

//Get single event by ID
export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
};

//Update event by ID
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.update(req.body);
    res.status(200).json({ message: "Event updated", event });
  } catch (err: any) {
    res.status(500).json({ message: "Error updating event", error: err.message });
  }
};

//Delete event by ID
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    res.status(200).json({ message: "Event deleted" });
  } catch (err: any) {
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
};
