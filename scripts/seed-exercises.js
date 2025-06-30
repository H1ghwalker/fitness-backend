const { Exercise } = require('../dist/models');
const sequelize = require('../dist/models').default;

const globalExercises = [
  // Cardio
  { name: 'Running', description: 'Cardiovascular exercise', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true },
  { name: 'Cycling', description: 'Low-impact cardio exercise', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true },
  { name: 'Jump Rope', description: 'High-intensity cardio', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true },
  { name: 'Elliptical', description: 'Low-impact cardio machine', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true },
  
  // Strength - Legs
  { name: 'Squats', description: 'Compound leg exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true },
  { name: 'Lunges', description: 'Unilateral leg exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true },
  { name: 'Leg Press', description: 'Machine leg exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true },
  { name: 'Deadlift', description: 'Compound posterior chain exercise', category: 'Strength', muscleGroup: 'Full Body', isGlobal: true },
  
  // Strength - Chest
  { name: 'Bench Press', description: 'Compound chest exercise', category: 'Strength', muscleGroup: 'Chest', isGlobal: true },
  { name: 'Push-ups', description: 'Bodyweight chest exercise', category: 'Strength', muscleGroup: 'Chest', isGlobal: true },
  { name: 'Dumbbell Flyes', description: 'Isolation chest exercise', category: 'Strength', muscleGroup: 'Chest', isGlobal: true },
  
  // Strength - Back
  { name: 'Pull-ups', description: 'Bodyweight back exercise', category: 'Strength', muscleGroup: 'Back', isGlobal: true },
  { name: 'Lat Pulldown', description: 'Machine back exercise', category: 'Strength', muscleGroup: 'Back', isGlobal: true },
  { name: 'Bent Over Row', description: 'Compound back exercise', category: 'Strength', muscleGroup: 'Back', isGlobal: true },
  
  // Strength - Shoulders
  { name: 'Dumbbell Press', description: 'Compound shoulder exercise', category: 'Strength', muscleGroup: 'Shoulders', isGlobal: true },
  { name: 'Lateral Raises', description: 'Isolation shoulder exercise', category: 'Strength', muscleGroup: 'Shoulders', isGlobal: true },
  
  // Strength - Arms
  { name: 'Bicep Curls', description: 'Isolation bicep exercise', category: 'Strength', muscleGroup: 'Arms', isGlobal: true },
  { name: 'Tricep Extensions', description: 'Isolation tricep exercise', category: 'Strength', muscleGroup: 'Arms', isGlobal: true },
  { name: 'Diamond Push-ups', description: 'Bodyweight tricep exercise', category: 'Strength', muscleGroup: 'Arms', isGlobal: true },
  
  // Strength - Abs
  { name: 'Crunches', description: 'Basic ab exercise', category: 'Strength', muscleGroup: 'Abs', isGlobal: true },
  { name: 'Leg Raises', description: 'Lower ab exercise', category: 'Strength', muscleGroup: 'Abs', isGlobal: true },
  
  // Functional
  { name: 'Burpees', description: 'Full body functional exercise', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true },
  { name: 'Plank', description: 'Core stability exercise', category: 'Functional', muscleGroup: 'Core', isGlobal: true },
  { name: 'Mountain Climbers', description: 'Dynamic core exercise', category: 'Functional', muscleGroup: 'Core', isGlobal: true },
  { name: 'Burpee with Push-up', description: 'Advanced burpee variation', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true },
  
  // Flexibility
  { name: 'Hamstring Stretch', description: 'Posterior chain stretch', category: 'Flexibility', muscleGroup: 'Legs', isGlobal: true },
  { name: 'Chest Stretch', description: 'Anterior chest stretch', category: 'Flexibility', muscleGroup: 'Chest', isGlobal: true },
  { name: 'Cat-Cow Stretch', description: 'Spinal mobility exercise', category: 'Flexibility', muscleGroup: 'Back', isGlobal: true },
  { name: 'Shoulder Stretch', description: 'Shoulder mobility exercise', category: 'Flexibility', muscleGroup: 'Shoulders', isGlobal: true },
  
  // Balance
  { name: 'Single Leg Stand', description: 'Basic balance exercise', category: 'Balance', muscleGroup: 'Legs', isGlobal: true },
  { name: 'Tree Pose', description: 'Yoga balance pose', category: 'Balance', muscleGroup: 'Full Body', isGlobal: true },
  { name: 'Side Plank', description: 'Lateral core stability', category: 'Balance', muscleGroup: 'Core', isGlobal: true }
];

async function seedExercises() {
  try {
    console.log('🌱 Starting exercise seeding...');
    
    // Check if exercises already exist
    const existingCount = await Exercise.count();
    if (existingCount > 0) {
      console.log(`📊 Found ${existingCount} existing exercises. Skipping...`);
      return;
    }
    
    console.log('📝 Creating global exercises...');
    
    // Create exercises with createdBy = 0 (system user)
    const exercises = await Exercise.bulkCreate(
      globalExercises.map(exercise => ({
        ...exercise,
        createdBy: 0 // System user for global exercises
      }))
    );
    
    console.log(`✅ Successfully created ${exercises.length} global exercises!`);
    console.log('📋 Categories created: Cardio, Strength, Functional, Flexibility, Balance');
    console.log('💪 Muscle groups: Legs, Chest, Back, Shoulders, Arms, Abs, Core, Full Body, General Endurance');
    
  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedExercises(); 