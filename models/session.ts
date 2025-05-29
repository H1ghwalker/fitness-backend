import { Sequelize, DataTypes, Model } from 'sequelize';

export interface SessionAttributes {
  id?: number;
  date: Date;
  note?: string;
  trainerId: number;
  clientId: number;
}

export class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: number;
  public date!: Date;
  public note?: string;
  public trainerId!: number;
  public clientId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initSessionModel = (sequelize: Sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      trainerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // оставляем как есть
          key: 'id',
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clients', // Исправляем на clients
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true,
    }
  );
};
