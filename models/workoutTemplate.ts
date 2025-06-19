import { Sequelize, DataTypes, Model } from 'sequelize';

export interface WorkoutTemplateAttributes {
  id?: number;
  name: string;
  createdBy: number;
}

export class WorkoutTemplate extends Model<WorkoutTemplateAttributes> implements WorkoutTemplateAttributes {
  public id!: number;
  public name!: string;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initWorkoutTemplateModel = (sequelize: Sequelize) => {
  WorkoutTemplate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      }
    },
    {
      sequelize,
      modelName: 'WorkoutTemplate',
      tableName: 'workout_templates',
      timestamps: true,
    }
  );
}; 