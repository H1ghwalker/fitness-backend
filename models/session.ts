import { Sequelize, DataTypes, Model } from 'sequelize';

export interface SessionAttributes {
  id?: number;
  date: Date;
  note?: string;
  duration?: number; // длительность в минутах
  trainerId: number;
  clientId: number;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  workoutTemplateId?: number; // НОВОЕ ПОЛЕ - ID шаблона тренировки
}

export class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: number;
  public date!: Date;
  public note?: string;
  public duration?: number;
  public trainerId!: number;
  public clientId!: number;
  public status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  public workoutTemplateId?: number;

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
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration of the session in minutes',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
        allowNull: true,
        defaultValue: 'scheduled',
        comment: 'Status of the session',
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
      workoutTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'workout_templates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID of the workout template for this session',
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
