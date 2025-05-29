import { Sequelize, DataTypes, Model } from "sequelize";
import { Session } from "./session";
import { User } from "./user";

interface ClientAttributes {
  id?: number;
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
  plan?: "Premium Monthly" | "Standard Weekly" | "Single Session";
  type?: "Subscription" | "One-time";
  nextSession?: Date;
  user_id: number;
  trainer_id?: number;
  Sessions?: Session[];
  User?: User;
}

export class Client extends Model<ClientAttributes> implements ClientAttributes {
  public id!: number;
  public goal?: string;
  public phone?: string;
  public address?: string;
  public notes?: string;
  public profile?: string;
  public plan?: "Premium Monthly" | "Standard Weekly" | "Single Session";
  public type?: "Subscription" | "One-time";
  public nextSession?: Date;
  public user_id!: number;
  public trainer_id!: number;
  public Sessions?: Session[];
  public User?: User;
}

export const initClientModel = (sequelize: Sequelize) => {
  Client.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      goal: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      notes: { type: DataTypes.STRING, allowNull: true },
      profile: { type: DataTypes.STRING, allowNull: true },
      plan: {
        type: DataTypes.ENUM("Premium Monthly", "Standard Weekly", "Single Session"),
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("Subscription", "One-time"),
        allowNull: true,
      },
      nextSession: { type: DataTypes.DATE, allowNull: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        // unique: true, // Убрано для расширения функционала
      },
      trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        // В будущем можно сделать allowNull: true
      },
    },
    {
      sequelize,
      modelName: "Client",
      tableName: "clients",
      timestamps: false,
    }
  );
};
