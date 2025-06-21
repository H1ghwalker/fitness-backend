import { Sequelize, DataTypes, Model } from 'sequelize';

export interface WorkoutExerciseAttributes {
  id?: number;
  workoutTemplateId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: string;
  notes?: string;
  orderIndex: number;
}

export class WorkoutExercise extends Model<WorkoutExerciseAttributes> implements WorkoutExerciseAttributes {
  public id!: number;
  public workoutTemplateId!: number;
  public exerciseId!: number;
  public sets!: number;
  public reps!: number;
  public weight?: string;
  public notes?: string;
  public orderIndex!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initWorkoutExerciseModel = (sequelize: Sequelize) => {
  WorkoutExercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      workoutTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'workout_templates', key: 'id' }
      },
      exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'exercises', key: 'id' }
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'WorkoutExercise',
      tableName: 'workout_exercises',
      timestamps: true,
    }
  );
}; 