import { Exercise, initializeModels } from '../models';
import sequelize from '../models';

const exercises = [
  // Cardio (15 exercises) - добавляем 12 новых к 3 существующим
  { name: 'Treadmill Running', description: 'Running on a treadmill at various speeds and inclines', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Stationary Cycling', description: 'Indoor cycling on a stationary bike', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Elliptical Training', description: 'Low-impact cardio exercise on elliptical machine', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Rowing Machine', description: 'Full-body cardio exercise using rowing machine', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Stair Climber', description: 'Climbing stairs on a machine for cardio', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'High-Intensity Interval Training', description: 'Alternating between high and low intensity periods', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Boxing Bag Workout', description: 'Punching and kicking a heavy bag for cardio', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Mountain Biking', description: 'Cycling on rough terrain for endurance', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Swimming', description: 'Full-body cardio exercise in water', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Jumping Jacks', description: 'Classic cardio exercise with jumping motion', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Burpee Box Jumps', description: 'Combined burpee and box jump for cardio', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },
  { name: 'Sprint Intervals', description: 'High-intensity sprint training', category: 'Cardio', muscleGroup: 'General Endurance', isGlobal: true, createdBy: 1 },

  // Strength (25 exercises) - добавляем 20 новых к 5 существующим
  { name: 'Barbell Bench Press', description: 'Classic chest exercise with barbell', category: 'Strength', muscleGroup: 'Chest', isGlobal: true, createdBy: 1 },
  { name: 'Dumbbell Incline Press', description: 'Chest exercise on inclined bench with dumbbells', category: 'Strength', muscleGroup: 'Chest', isGlobal: true, createdBy: 1 },
  { name: 'Decline Push-ups', description: 'Push-ups with feet elevated for lower chest focus', category: 'Strength', muscleGroup: 'Chest', isGlobal: true, createdBy: 1 },
  { name: 'Cable Flyes', description: 'Chest isolation exercise using cable machine', category: 'Strength', muscleGroup: 'Chest', isGlobal: true, createdBy: 1 },
  { name: 'Pull-up Variations', description: 'Different grip variations for back strength', category: 'Strength', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'Lat Pulldown Machine', description: 'Back exercise using cable machine', category: 'Strength', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'Bent Over Barbell Row', description: 'Compound back exercise with barbell', category: 'Strength', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'T-Bar Row', description: 'Back exercise using T-bar machine', category: 'Strength', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'Military Press', description: 'Overhead shoulder press with barbell', category: 'Strength', muscleGroup: 'Shoulders', isGlobal: true, createdBy: 1 },
  { name: 'Front Raises', description: 'Anterior deltoid exercise with dumbbells', category: 'Strength', muscleGroup: 'Shoulders', isGlobal: true, createdBy: 1 },
  { name: 'Barbell Curls', description: 'Classic bicep exercise with barbell', category: 'Strength', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Hammer Curls', description: 'Bicep exercise with neutral grip', category: 'Strength', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Tricep Dips', description: 'Bodyweight tricep exercise', category: 'Strength', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Skull Crushers', description: 'Tricep isolation exercise with barbell', category: 'Strength', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Barbell Squats', description: 'Compound leg exercise with barbell', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Deadlift Variations', description: 'Different deadlift forms for overall strength', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Leg Press Machine', description: 'Leg exercise using machine', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Walking Lunges', description: 'Dynamic leg exercise with forward movement', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Romanian Deadlift', description: 'Hip hinge exercise focusing on hamstrings', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Leg Extensions', description: 'Quadriceps isolation exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Leg Curls', description: 'Hamstring isolation exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Calf Raises', description: 'Calf muscle exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Hip Thrusts', description: 'Glute-focused exercise', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Bulgarian Split Squats', description: 'Unilateral leg exercise with rear foot elevated', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Step-ups', description: 'Leg exercise using elevated platform', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Goblet Squats', description: 'Squat variation holding weight at chest', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Box Jumps', description: 'Explosive leg exercise jumping onto box', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Pistol Squats', description: 'Advanced single-leg squat', category: 'Strength', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },

  // Functional (20 exercises) - добавляем 17 новых к 3 существующим
  { name: 'Burpee Variations', description: 'Full-body functional exercise with different modifications', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Turkish Get-up', description: 'Complex full-body movement', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Medicine Ball Slams', description: 'Explosive full-body exercise', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Kettlebell Swings', description: 'Hip hinge exercise with kettlebell', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Battle Ropes', description: 'Cardio and strength exercise with ropes', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Farmer\'s Walk', description: 'Grip and core exercise carrying weights', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Bear Crawl', description: 'Full-body movement on hands and feet', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Spider Crawl', description: 'Advanced crawling movement', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Plank Variations', description: 'Different plank positions for core stability', category: 'Functional', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Woodchoppers', description: 'Rotational core exercise', category: 'Functional', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Dead Bug', description: 'Core stability exercise lying on back', category: 'Functional', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Bird Dog', description: 'Core stability exercise on hands and knees', category: 'Functional', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Bicycle Crunches', description: 'Dynamic ab exercise with cycling motion', category: 'Functional', muscleGroup: 'Abs', isGlobal: true, createdBy: 1 },
  { name: 'Ab Wheel Rollout', description: 'Advanced core exercise using ab wheel', category: 'Functional', muscleGroup: 'Abs', isGlobal: true, createdBy: 1 },
  { name: 'Hanging Leg Raises', description: 'Advanced ab exercise hanging from bar', category: 'Functional', muscleGroup: 'Abs', isGlobal: true, createdBy: 1 },
  { name: 'Mountain Climber Burpees', description: 'Combined mountain climbers and burpees', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Wall Ball Shots', description: 'Medicine ball throws against wall', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Sandbag Carries', description: 'Carrying sandbag for functional strength', category: 'Functional', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },

  // Flexibility (15 exercises) - добавляем 12 новых к 3 существующим
  { name: 'Dynamic Stretching', description: 'Moving stretches to warm up muscles', category: 'Flexibility', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Static Stretching', description: 'Holding stretches for muscle lengthening', category: 'Flexibility', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Yoga Flow', description: 'Flowing yoga sequence for flexibility', category: 'Flexibility', muscleGroup: 'Full Body', isGlobal: true, createdBy: 1 },
  { name: 'Pilates', description: 'Core-focused flexibility and strength', category: 'Flexibility', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Hip Flexor Stretch', description: 'Stretching hip flexor muscles', category: 'Flexibility', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Quad Stretch', description: 'Stretching quadriceps muscles', category: 'Flexibility', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Calf Stretch', description: 'Stretching calf muscles', category: 'Flexibility', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Shoulder Mobility', description: 'Shoulder range of motion exercises', category: 'Flexibility', muscleGroup: 'Shoulders', isGlobal: true, createdBy: 1 },
  { name: 'Thoracic Extension', description: 'Upper back mobility exercise', category: 'Flexibility', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'Ankle Mobility', description: 'Ankle range of motion exercises', category: 'Flexibility', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Wrist Mobility', description: 'Wrist range of motion exercises', category: 'Flexibility', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Neck Stretches', description: 'Gentle neck stretching exercises', category: 'Flexibility', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },

  // Balance (15 exercises) - добавляем 12 новых к 3 существующим
  { name: 'Single Leg Deadlift', description: 'Balance exercise with hip hinge', category: 'Balance', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Warrior Pose', description: 'Yoga balance pose for stability', category: 'Balance', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Eagle Pose', description: 'Advanced yoga balance pose', category: 'Balance', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Half Moon Pose', description: 'Yoga balance pose on one leg', category: 'Balance', muscleGroup: 'Legs', isGlobal: true, createdBy: 1 },
  { name: 'Crow Pose', description: 'Arm balance yoga pose', category: 'Balance', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Headstand', description: 'Advanced inverted balance pose', category: 'Balance', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Handstand', description: 'Advanced hand balance pose', category: 'Balance', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'L-Sit', description: 'Static hold with legs extended', category: 'Balance', muscleGroup: 'Core', isGlobal: true, createdBy: 1 },
  { name: 'Tuck Planche', description: 'Advanced static hold exercise', category: 'Balance', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Human Flag', description: 'Advanced side hold exercise', category: 'Balance', muscleGroup: 'Arms', isGlobal: true, createdBy: 1 },
  { name: 'Front Lever', description: 'Advanced back strength hold', category: 'Balance', muscleGroup: 'Back', isGlobal: true, createdBy: 1 },
  { name: 'Back Lever', description: 'Advanced back strength hold variation', category: 'Balance', muscleGroup: 'Back', isGlobal: true, createdBy: 1 }
];

async function seedExercises() {
  try {
    await sequelize.authenticate();
    initializeModels(); // Инициализация моделей
    console.log('🌱 Starting extended exercise seeding...');

    // Check if any of these exercises already exist
    const existingNames = await Exercise.findAll({
      where: {
        name: exercises.map(e => e.name)
      },
      attributes: ['name']
    });
    
    if (existingNames.length > 0) {
      console.log(`⚠️  Found ${existingNames.length} existing exercises. Skipping seeding.`);
      console.log('Existing exercises:', existingNames.map(e => e.name).join(', '));
      return;
    }

    // Create exercises using bulkCreate for better performance
    const createdExercises = await Exercise.bulkCreate(exercises);

    console.log(`✅ Successfully seeded ${createdExercises.length} exercises!`);
    console.log('\n📊 Exercise breakdown:');
    console.log(`- Cardio: ${exercises.filter(e => e.category === 'Cardio').length} exercises`);
    console.log(`- Strength: ${exercises.filter(e => e.category === 'Strength').length} exercises`);
    console.log(`- Functional: ${exercises.filter(e => e.category === 'Functional').length} exercises`);
    console.log(`- Flexibility: ${exercises.filter(e => e.category === 'Flexibility').length} exercises`);
    console.log(`- Balance: ${exercises.filter(e => e.category === 'Balance').length} exercises`);
    console.log(`\n🎯 Total exercises after seeding: ${33 + createdExercises.length}/100`);

  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
  } finally {
    await sequelize.close();
  }
}

seedExercises(); 