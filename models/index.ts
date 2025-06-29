import { Sequelize } from 'sequelize';
import { initClientModel, Client } from './client';
import { initUserModel, User } from './user';
import { initSessionModel, Session } from './session';
import { initExerciseModel, Exercise } from './exercise';
import { initWorkoutTemplateModel, WorkoutTemplate } from './workoutTemplate';
import { initWorkoutExerciseModel, WorkoutExercise } from './workoutExercise';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://fitness_user:fitness_password@localhost:5432/fitness_db',
  { dialect: 'postgres' }
);

export const initializeModels = () => {
  // Инициализация моделей
  initUserModel(sequelize);
  initClientModel(sequelize);
  initSessionModel(sequelize);
  initExerciseModel(sequelize);
  initWorkoutTemplateModel(sequelize);
  initWorkoutExerciseModel(sequelize);

  if (!User || !Client || !Exercise || !WorkoutTemplate || !WorkoutExercise) {
    throw new Error('One or more models failed to initialize');
  }

  // Ассоциации для Client
  Client.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'User',
    scope: {
      role: 'Client'
    }
  }); 
  // Клиент связан с пользователем (основные данные о клиенте)

  User.hasOne(Client, { 
    foreignKey: 'user_id', 
    as: 'Client',
    scope: {
      role: 'Client'
    }
  });
  // У пользователя может быть только один профиль клиента (MVP: 1:1)

  Client.belongsTo(User, { 
    foreignKey: 'trainer_id', 
    as: 'Trainer',
    scope: {
      role: 'Trainer'
    }
  });
  // Клиент привязан к тренеру (тренер — это пользователь)

  User.hasMany(Client, { 
    foreignKey: 'trainer_id', 
    as: 'TrainerClients',
    scope: {
      role: 'Trainer'
    }
  });
  // Тренер может иметь много клиентов (1:M)

  // Клиент может иметь назначенный шаблон тренировки
  // Client.belongsTo(WorkoutTemplate, {
  //   foreignKey: 'assignedTemplateId',
  //   as: 'AssignedTemplate'
  // });
  // WorkoutTemplate.hasMany(Client, {
  //   foreignKey: 'assignedTemplateId',
  //   as: 'AssignedClients'
  // });

  // Ассоциации для Session
  Session.belongsTo(User, { 
    foreignKey: 'trainerId',
    as: 'Trainer',
    scope: {
      role: 'Trainer'
    }
  });
  // Сессия привязана к тренеру (тренер — это пользователь)

  Session.belongsTo(Client, { 
    foreignKey: 'clientId',
    as: 'Client',
    onDelete: 'CASCADE'
  });
  // Сессия привязана к клиенту (через таблицу clients)

  Client.hasMany(Session, { 
    foreignKey: 'clientId',
    as: 'Sessions',
    onDelete: 'CASCADE'
  });
  // Клиент может иметь много сессий (1:M)

  User.hasMany(Session, { 
    foreignKey: 'trainerId',
    as: 'TrainerSessions',
    scope: {
      role: 'Trainer'
    }
  });
  
  // Тренер может иметь много сессий (1:M)
  // Ассоциации для TrainingProgram (если есть)
  // Client.belongsToMany(TrainingProgram, { through: 'ClientPrograms' });
  // TrainingProgram.belongsToMany(Client, { through: 'ClientPrograms' });
  // User.hasMany(TrainingProgram, { foreignKey: 'trainerId', as: 'TrainingPrograms' });

  // Ассоциации для Exercise
  Exercise.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'Creator',
    scope: { role: 'Trainer' }
  });
  User.hasMany(Exercise, {
    foreignKey: 'createdBy',
    as: 'CreatedExercises'
  });

  // WorkoutTemplate принадлежит тренеру
  WorkoutTemplate.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'Creator',
    scope: { role: 'Trainer' }
  });
  User.hasMany(WorkoutTemplate, {
    foreignKey: 'createdBy',
    as: 'WorkoutTemplates'
  });

  // WorkoutTemplate содержит много WorkoutExercise
  WorkoutTemplate.hasMany(WorkoutExercise, {
    foreignKey: 'workoutTemplateId',
    as: 'Exercises',
    onDelete: 'CASCADE'
  });
  WorkoutExercise.belongsTo(WorkoutTemplate, {
    foreignKey: 'workoutTemplateId',
    as: 'WorkoutTemplate'
  });

  // WorkoutExercise ссылается на Exercise
  WorkoutExercise.belongsTo(Exercise, {
    foreignKey: 'exerciseId',
    as: 'Exercise'
  });
  Exercise.hasMany(WorkoutExercise, {
    foreignKey: 'exerciseId',
    as: 'WorkoutExercises'
  });
};

export default sequelize;
export { User, Client, Session, Exercise, WorkoutTemplate, WorkoutExercise };
