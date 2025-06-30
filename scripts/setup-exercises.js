#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up exercise library...\n');

try {
  // 1. Run migration for isGlobal field
  console.log('📦 Running migration for isGlobal field...');
  execSync('npx sequelize-cli db:migrate', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ Migration completed\n');

  // 2. Run exercise seeding script
  console.log('🌱 Seeding global exercises...');
  execSync('npx ts-node scripts/seed-exercises.ts', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ Exercise seeding completed\n');

  console.log('🎉 Exercise library setup completed successfully!');
  console.log('\n📋 Available endpoints:');
  console.log('  GET /api/exercises - All exercises (global + personal)');
  console.log('  GET /api/exercises/global - Global exercises only');
  console.log('  GET /api/exercises/personal - Personal exercises only');
  console.log('  POST /api/exercises - Create personal exercise');
  console.log('  DELETE /api/exercises/:id - Delete personal exercise');

} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
} 