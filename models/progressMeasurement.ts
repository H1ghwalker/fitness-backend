import { Sequelize, DataTypes, Model } from 'sequelize';

export interface ProgressMeasurementAttributes {
  id?: number;
  clientId: number;
  date: Date;
  weight?: number;        // кг
  chest?: number;         // см
  waist?: number;         // см
  hips?: number;          // см
  biceps?: number;        // см
  notes?: string;
}

export class ProgressMeasurement extends Model<ProgressMeasurementAttributes> implements ProgressMeasurementAttributes {
  public id!: number;
  public clientId!: number;
  public date!: Date;
  public weight?: number;
  public chest?: number;
  public waist?: number;
  public hips?: number;
  public biceps?: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initProgressMeasurementModel = (sequelize: Sequelize) => {
  ProgressMeasurement.init(
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
          min: 20,
          max: 300,
        },
        comment: 'Weight in kilograms',
      },
      chest: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 50,
          max: 200,
        },
        comment: 'Chest circumference in centimeters',
      },
      waist: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 40,
          max: 200,
        },
        comment: 'Waist circumference in centimeters',
      },
      hips: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 50,
          max: 200,
        },
        comment: 'Hips circumference in centimeters',
      },
      biceps: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 15,
          max: 100,
        },
        comment: 'Biceps circumference in centimeters',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about the measurement',
      },
    },
    {
      sequelize,
      modelName: 'ProgressMeasurement',
      tableName: 'progress_measurements',
      timestamps: true,
      indexes: [
        {
          fields: ['clientId', 'date'],
          unique: true,
        },
      ],
    }
  );
}; 