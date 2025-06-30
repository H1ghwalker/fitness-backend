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
  console.log('🔧 Starting model initialization...');
  console.log('🔧 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  try {
    // Инициализация моделей
    console.log('🔧 Initializing User model...');
    initUserModel(sequelize);
    
    console.log('🔧 Initializing Client model...');
    initClientModel(sequelize);
    
    console.log('🔧 Initializing Session model...');
    initSessionModel(sequelize);
    
    console.log('🔧 Initializing Exercise model...');
    initExerciseModel(sequelize);
    
    console.log('🔧 Initializing WorkoutTemplate model...');
    initWorkoutTemplateModel(sequelize);
    
    console.log('🔧 Initializing WorkoutExercise model...');
    initWorkoutExerciseModel(sequelize);

    if (!User || !Client || !Exercise || !WorkoutTemplate || !WorkoutExercise) {
      throw new Error('One or more models failed to initialize');
    }

    console.log('🔧 All models initialized successfully');

    // Ассоциации для Client
    console.log('🔧 Setting up Client associations...');
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

    // Ассоциации для Session
    console.log('🔧 Setting up Session associations...');
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
    
    // Session может иметь назначенный шаблон тренировки
    Session.belongsTo(WorkoutTemplate, {
      foreignKey: 'workoutTemplateId',
      as: 'WorkoutTemplate'
    });
    WorkoutTemplate.hasMany(Session, {
      foreignKey: 'workoutTemplateId',
      as: 'Sessions'
    });
    
    // Ассоциации для TrainingProgram (если есть)
    // Client.belongsToMany(TrainingProgram, { through: 'ClientPrograms' });
    // TrainingProgram.belongsToMany(Client, { through: 'ClientPrograms' });
    // User.hasMany(TrainingProgram, { foreignKey: 'trainerId', as: 'TrainingPrograms' });

    // Ассоциации для Exercise
    console.log('🔧 Setting up Exercise associations...');
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

    console.log('✅ All associations set up successfully');
    console.log('✅ Model initialization completed');
  } catch (error) {
    console.error('❌ Error during model initialization:', error);
    throw error;
  }
};

export default sequelize;
export { User, Client, Session, Exercise, WorkoutTemplate, WorkoutExercise };
