import { Sequelize } from 'sequelize';
import { Exercise } from '../models/exercise';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://fitness_user:fitness_password@localhost:5432/fitness_db',
  { dialect: 'postgres' }
);

const exercises = [
  // Cardio (10 exercises)
  { name: 'Treadmill Running', description: 'Running on a treadmill at various speeds and inclines', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Stationary Cycling', description: 'Indoor cycling on a stationary bike', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Jump Rope', description: 'Skipping rope for cardiovascular fitness', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Elliptical Training', description: 'Low-impact cardio exercise on elliptical machine', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Rowing Machine', description: 'Full-body cardio exercise using rowing machine', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Stair Climber', description: 'Climbing stairs on a machine for cardio', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'High-Intensity Interval Training', description: 'Alternating between high and low intensity periods', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Boxing Bag Workout', description: 'Punching and kicking a heavy bag for cardio', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Mountain Biking', description: 'Cycling on rough terrain for endurance', category: 'Cardio', muscleGroup: 'General Endurance' },
  { name: 'Swimming', description: 'Full-body cardio exercise in water', category: 'Cardio', muscleGroup: 'General Endurance' },

  // Strength - Upper Body (15 exercises)
  { name: 'Barbell Bench Press', description: 'Classic chest exercise with barbell', category: 'Strength', muscleGroup: 'Chest' },
  { name: 'Dumbbell Incline Press', description: 'Chest exercise on inclined bench with dumbbells', category: 'Strength', muscleGroup: 'Chest' },
  { name: 'Decline Push-ups', description: 'Push-ups with feet elevated for lower chest focus', category: 'Strength', muscleGroup: 'Chest' },
  { name: 'Cable Flyes', description: 'Chest isolation exercise using cable machine', category: 'Strength', muscleGroup: 'Chest' },
  { name: 'Pull-up Variations', description: 'Different grip variations for back strength', category: 'Strength', muscleGroup: 'Back' },
  { name: 'Lat Pulldown Machine', description: 'Back exercise using cable machine', category: 'Strength', muscleGroup: 'Back' },
  { name: 'Bent Over Barbell Row', description: 'Compound back exercise with barbell', category: 'Strength', muscleGroup: 'Back' },
  { name: 'T-Bar Row', description: 'Back exercise using T-bar machine', category: 'Strength', muscleGroup: 'Back' },
  { name: 'Military Press', description: 'Overhead shoulder press with barbell', category: 'Strength', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raises', description: 'Shoulder isolation exercise with dumbbells', category: 'Strength', muscleGroup: 'Shoulders' },
  { name: 'Front Raises', description: 'Anterior deltoid exercise with dumbbells', category: 'Strength', muscleGroup: 'Shoulders' },
  { name: 'Barbell Curls', description: 'Classic bicep exercise with barbell', category: 'Strength', muscleGroup: 'Arms' },
  { name: 'Hammer Curls', description: 'Bicep exercise with neutral grip', category: 'Strength', muscleGroup: 'Arms' },
  { name: 'Tricep Dips', description: 'Bodyweight tricep exercise', category: 'Strength', muscleGroup: 'Arms' },
  { name: 'Skull Crushers', description: 'Tricep isolation exercise with barbell', category: 'Strength', muscleGroup: 'Arms' },

  // Strength - Lower Body (15 exercises)
  { name: 'Barbell Squats', description: 'Compound leg exercise with barbell', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Deadlift Variations', description: 'Different deadlift forms for overall strength', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Leg Press Machine', description: 'Leg exercise using machine', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Walking Lunges', description: 'Dynamic leg exercise with forward movement', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', description: 'Hip hinge exercise focusing on hamstrings', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Leg Extensions', description: 'Quadriceps isolation exercise', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Leg Curls', description: 'Hamstring isolation exercise', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Calf Raises', description: 'Calf muscle exercise', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Hip Thrusts', description: 'Glute-focused exercise', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Bulgarian Split Squats', description: 'Unilateral leg exercise with rear foot elevated', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Step-ups', description: 'Leg exercise using elevated platform', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Goblet Squats', description: 'Squat variation holding weight at chest', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Box Jumps', description: 'Explosive leg exercise jumping onto box', category: 'Strength', muscleGroup: 'Legs' },
  { name: 'Pistol Squats', description: 'Advanced single-leg squat', category: 'Strength', muscleGroup: 'Legs' },

  // Core & Abs (10 exercises)
  { name: 'Plank Variations', description: 'Different plank positions for core stability', category: 'Functional', muscleGroup: 'Core' },
  { name: 'Bicycle Crunches', description: 'Dynamic ab exercise with cycling motion', category: 'Strength', muscleGroup: 'Abs' },
  { name: 'Leg Raises', description: 'Lower ab exercise lying on back', category: 'Strength', muscleGroup: 'Abs' },
  { name: 'Mountain Climbers', description: 'Dynamic core exercise with running motion', category: 'Functional', muscleGroup: 'Core' },
  { name: 'Side Plank', description: 'Core exercise focusing on obliques', category: 'Functional', muscleGroup: 'Core' },
  { name: 'Ab Wheel Rollout', description: 'Advanced core exercise using ab wheel', category: 'Strength', muscleGroup: 'Abs' },
  { name: 'Hanging Leg Raises', description: 'Advanced ab exercise hanging from bar', category: 'Strength', muscleGroup: 'Abs' },
  { name: 'Woodchoppers', description: 'Rotational core exercise', category: 'Functional', muscleGroup: 'Core' },
  { name: 'Dead Bug', description: 'Core stability exercise lying on back', category: 'Functional', muscleGroup: 'Core' },
  { name: 'Bird Dog', description: 'Core stability exercise on hands and knees', category: 'Functional', muscleGroup: 'Core' },

  // Functional & Balance (10 exercises)
  { name: 'Burpee Variations', description: 'Full-body functional exercise with different modifications', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Turkish Get-up', description: 'Complex full-body movement', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Single Leg Stand', description: 'Balance exercise on one leg', category: 'Balance', muscleGroup: 'Legs' },
  { name: 'Tree Pose', description: 'Yoga balance pose standing on one leg', category: 'Balance', muscleGroup: 'Legs' },
  { name: 'Medicine Ball Slams', description: 'Explosive full-body exercise', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Kettlebell Swings', description: 'Hip hinge exercise with kettlebell', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Battle Ropes', description: 'Cardio and strength exercise with ropes', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Farmer\'s Walk', description: 'Grip and core exercise carrying weights', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Bear Crawl', description: 'Full-body movement on hands and feet', category: 'Functional', muscleGroup: 'Full Body' },
  { name: 'Spider Crawl', description: 'Advanced crawling movement', category: 'Functional', muscleGroup: 'Full Body' }
];

async function seedExercises() {
  try {
    console.log('🌱 Starting extended exercise seeding...');
    
    // Check if exercises already exist
    const existingCount = await Exercise.count();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing exercises. Skipping seeding.`);
      return;
    }

    // Create exercises
    for (const exercise of exercises) {
      await Exercise.create({
        ...exercise,
        createdBy: 1, // Global exercises created by system
        isGlobal: true
      });
    }

    console.log(`✅ Successfully seeded ${exercises.length} exercises!`);
    console.log('\n📊 Exercise breakdown:');
    console.log(`- Cardio: ${exercises.filter(e => e.category === 'Cardio').length} exercises`);
    console.log(`- Strength: ${exercises.filter(e => e.category === 'Strength').length} exercises`);
    console.log(`- Functional: ${exercises.filter(e => e.category === 'Functional').length} exercises`);
    console.log(`- Balance: ${exercises.filter(e => e.category === 'Balance').length} exercises`);

  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
  } finally {
    await sequelize.close();
  }
}

seedExercises(); 