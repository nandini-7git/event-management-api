import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Ticket from "./Ticket";

class Attendee extends Model {
  public id!: number;
  public ticketId!: number;
  public name!: string;
  public email!: string;
}

Attendee.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticketId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Attendee", tableName: "attendees", timestamps: true }
);

Attendee.belongsTo(Ticket, { foreignKey: "ticketId" });

export default Attendee;
