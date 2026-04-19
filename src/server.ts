import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db";

//Routes
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();

const app: Application = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payment", paymentRoutes); 

//Starting server and sync database
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); //Auto-update DB schema
    console.log("✅ Database synced successfully!");

    const PORT: number = parseInt(process.env.PORT || "5050", 10);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    console.error("❌ Database sync failed:", err);
  }
};

startServer();
