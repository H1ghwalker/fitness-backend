import { Sequelize, DataTypes, Model } from 'sequelize';

export interface ExerciseAttributes {
  id?: number;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  createdBy: number; // ID тренера
}

export class Exercise extends Model<ExerciseAttributes> implements ExerciseAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public muscleGroup!: string;
  public createdBy!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initExerciseModel = (sequelize: Sequelize) => {
  Exercise.init(
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
      description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
      },
      category: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      muscleGroup: {
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
      modelName: 'Exercise',
      tableName: 'exercises',
      timestamps: true,
    }
  );
}; 