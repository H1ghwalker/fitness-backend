import { Sequelize, DataTypes, Model } from 'sequelize';

// Interface for Client model
interface ClientAttributes {
  id?: number;
  name: string;
  email: string;
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
  plan?: 'Premium Monthly' | 'Standard Weekly' | 'Single Session';
  nextSession?: string;
}

// Client model
export class Client extends Model<ClientAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public goal?: string;
  public phone?: string;
  public address?: string;
  public notes?: string;
  public profile?: string;
  public plan?: 'Premium Monthly' | 'Standard Weekly' | 'Single Session';
  public nextSession?: string;
}

export const initClientModel = (sequelize: Sequelize) => {
  Client.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      goal: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      notes: { type: DataTypes.STRING, allowNull: true },
      profile: { type: DataTypes.STRING, allowNull: true },
      plan: { type: DataTypes.ENUM('Premium Monthly', 'Standard Weekly', 'Single Session'), allowNull: true },
      nextSession: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Client',
      tableName: 'clients',
      timestamps: false,
    }
  );
};