import { Sequelize } from 'sequelize';
import { initClientModel, Client } from './client';
import { initUserModel, User } from './user';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://fitness_user:fitness_password@localhost:5432/fitness_db', {
  dialect: 'postgres',
});

export const initializeModels = () => {
  // Спочатку ініціалізуємо моделі
  initUserModel(sequelize);
  initClientModel(sequelize);

  // Перевіряємо, що моделі ініціалізовані
  if (!User || !Client) {
    throw new Error('One or more models failed to initialize');
  }

  // Потім встановлюємо асоціації
  Client.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
  User.hasOne(Client, { foreignKey: 'user_id', as: 'Client' });

  Client.belongsTo(User, { foreignKey: 'trainer_id', as: 'Trainer' });
  User.hasMany(Client, { foreignKey: 'trainer_id', as: 'Clients' });
};


export default sequelize;