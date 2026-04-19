
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Event from "./Event";

class Ticket extends Model {
  public id!: number;
  public eventId!: number;
  public userId!: number;
  public type!: string;
  public qrCode!: string;
  public paymentId!: string; // ← NEW
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    paymentId: {          // ← ADD THIS
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Ticket",
    tableName: "tickets",
    timestamps: true,
  }
);

// Associations
Ticket.belongsTo(User, { foreignKey: "userId" });
Ticket.belongsTo(Event, { foreignKey: "eventId" });

export default Ticket;
