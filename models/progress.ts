import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ProgressAttributes {
  id: number;
  clientId: number;
  date: Date;
  type: 'weight' | 'measurements' | 'strength' | 'cardio' | 'flexibility' | 'body_composition';
  category: string; // например: 'bench_press', 'weight', 'waist_circumference'
  value: number;
  unit: string; // 'kg', 'cm', 'reps', 'minutes', '%'
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgressCreationAttributes extends Optional<ProgressAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public id!: number;
  public clientId!: number;
  public date!: Date;
  public type!: 'weight' | 'measurements' | 'strength' | 'cardio' | 'flexibility' | 'body_composition';
  public category!: string;
  public value!: number;
  public unit!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initProgressModel = (sequelize: Sequelize) => {
  Progress.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('weight', 'measurements', 'strength', 'cardio', 'flexibility', 'body_composition'),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'progress',
      timestamps: true,
    }
  );
}; 