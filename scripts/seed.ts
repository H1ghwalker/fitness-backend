import sequelize from '../models';
import { initializeModels } from '../models';
import { User } from '../models/user';
import { Client } from '../models/client';

const run = async () => {
  initializeModels(); 

  await sequelize.sync({ force: true });

  // --- Тренеры ---
  const trainer1 = await User.create({
    name: 'Alice Smith',
    email: 'alice@example.com',
    passwordHash: 'hashed123',
    role: 'Trainer',
  });

  const trainer2 = await User.create({
    name: 'Bob Johnson',
    email: 'bob@example.com',
    passwordHash: 'hashed456',
    role: 'Trainer',
  });

  // --- Клиенты ---
  const client1User = await User.create({
    name: 'Client One',
    email: 'client1@example.com',
    passwordHash: 'pass1',
    role: 'Client',
  });

  const client2User = await User.create({
    name: 'Client Two',
    email: 'client2@example.com',
    passwordHash: 'pass2',
    role: 'Client',
  });

  const client3User = await User.create({
    name: 'Client Three',
    email: 'client3@example.com',
    passwordHash: 'pass3',
    role: 'Client',
  });

  await Client.create({
    user_id: client1User.id,
    trainer_id: trainer1.id,
    goal: 'Lose weight',
    plan: 'Premium Monthly',
    type: 'Subscription',
    phone: '+380111111111',
  });

  await Client.create({
    user_id: client2User.id,
    trainer_id: trainer1.id,
    goal: 'Build muscle',
    plan: 'Standard Weekly',
    type: 'Subscription',
    phone: '+380222222222',
  });

  await Client.create({
    user_id: client3User.id,
    trainer_id: trainer2.id,
    goal: 'General fitness',
    plan: 'Single Session',
    type: 'One-time',
    phone: '+380333333333',
  });

  console.log('✅ Seed complete');
  await sequelize.close();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err);
});
