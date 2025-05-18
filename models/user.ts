import { Sequelize, DataTypes, Model } from 'sequelize';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Trainer' | 'Client';
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'Trainer' | 'Client';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('Trainer', 'Client'), allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
    }
  );
};
