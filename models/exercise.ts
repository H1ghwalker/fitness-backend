import { Sequelize, DataTypes, Model } from 'sequelize';

export interface ExerciseAttributes {
  id?: number;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  createdBy: number; // ID тренера или 0 для глобальных
  isGlobal: boolean; // Глобальное упражнение или персональное
}

export class Exercise extends Model<ExerciseAttributes> implements ExerciseAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public muscleGroup!: string;
  public createdBy!: number;
  public isGlobal!: boolean;

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
      },
      isGlobal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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