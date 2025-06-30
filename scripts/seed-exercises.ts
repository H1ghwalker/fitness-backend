import { Exercise, initializeModels } from '../models';
import sequelize from '../models';

const globalExercises = [
  // Cardio exercises (3)
  {
    name: 'Running',
    description: 'Moderate pace running for endurance development',
    category: 'Cardio',
    muscleGroup: 'General Endurance',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Cycling',
    description: 'Stationary bike training for cardiovascular system development',
    category: 'Cardio',
    muscleGroup: 'General Endurance',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Jump Rope',
    description: 'Jump rope for coordination and endurance development',
    category: 'Cardio',
    muscleGroup: 'General Endurance',
    isGlobal: true,
    createdBy: 1
  },

  // Strength exercises (3)
  {
    name: 'Squats',
    description: 'Classic squats for leg muscle development',
    category: 'Strength',
    muscleGroup: 'Legs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Bench Press',
    description: 'Barbell bench press for chest muscle development',
    category: 'Strength',
    muscleGroup: 'Chest',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Pull-ups',
    description: 'Pull-ups on bar for back muscle development',
    category: 'Strength',
    muscleGroup: 'Back',
    isGlobal: true,
    createdBy: 1
  },

  // Functional exercises (3)
  {
    name: 'Burpees',
    description: 'Complex exercise for endurance and strength development',
    category: 'Functional',
    muscleGroup: 'Full Body',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Plank',
    description: 'Static plank exercise for core strengthening',
    category: 'Functional',
    muscleGroup: 'Core',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Mountain Climbers',
    description: 'Dynamic core exercise with cardio element',
    category: 'Functional',
    muscleGroup: 'Core',
    isGlobal: true,
    createdBy: 1
  },

  // Flexibility exercises (3)
  {
    name: 'Hamstring Stretch',
    description: 'Static hamstring stretch for flexibility',
    category: 'Flexibility',
    muscleGroup: 'Legs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Chest Stretch',
    description: 'Doorway chest stretch for pectoral flexibility',
    category: 'Flexibility',
    muscleGroup: 'Chest',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Cat-Cow Stretch',
    description: 'Dynamic spine mobility exercise',
    category: 'Flexibility',
    muscleGroup: 'Back',
    isGlobal: true,
    createdBy: 1
  },

  // Balance exercises (3)
  {
    name: 'Single Leg Stand',
    description: 'Balance exercise on one leg',
    category: 'Balance',
    muscleGroup: 'Legs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Tree Pose',
    description: 'Yoga balance pose for stability and focus',
    category: 'Balance',
    muscleGroup: 'Full Body',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Side Plank',
    description: 'Balance and core exercise',
    category: 'Balance',
    muscleGroup: 'Core',
    isGlobal: true,
    createdBy: 1
  },

  // Additional exercises to complete 3 per muscle group
  
  // Legs (3 total)
  {
    name: 'Lunges',
    description: 'Forward lunges for leg and glute development',
    category: 'Strength',
    muscleGroup: 'Legs',
    isGlobal: true,
    createdBy: 1
  },

  // Chest (3 total)
  {
    name: 'Push-ups',
    description: 'Floor push-ups for chest and triceps development',
    category: 'Strength',
    muscleGroup: 'Chest',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Dumbbell Flyes',
    description: 'Dumbbell flyes for chest muscle isolation',
    category: 'Strength',
    muscleGroup: 'Chest',
    isGlobal: true,
    createdBy: 1
  },

  // Back (3 total)
  {
    name: 'Lat Pulldown',
    description: 'Lat pulldown to chest for back muscle development',
    category: 'Strength',
    muscleGroup: 'Back',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Bent Over Row',
    description: 'Bent over barbell row for back muscle development',
    category: 'Strength',
    muscleGroup: 'Back',
    isGlobal: true,
    createdBy: 1
  },

  // Shoulders (3 total)
  {
    name: 'Dumbbell Press',
    description: 'Standing dumbbell press for deltoid development',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Lateral Raises',
    description: 'Dumbbell lateral raises for middle deltoid development',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Shoulder Stretch',
    description: 'Cross-body shoulder stretch for deltoid flexibility',
    category: 'Flexibility',
    muscleGroup: 'Shoulders',
    isGlobal: true,
    createdBy: 1
  },

  // Arms (3 total)
  {
    name: 'Bicep Curls',
    description: 'Dumbbell bicep curls for bicep development',
    category: 'Strength',
    muscleGroup: 'Arms',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Tricep Extensions',
    description: 'Tricep extensions on machine',
    category: 'Strength',
    muscleGroup: 'Arms',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Diamond Push-ups',
    description: 'Advanced push-ups targeting triceps',
    category: 'Strength',
    muscleGroup: 'Arms',
    isGlobal: true,
    createdBy: 1
  },

  // Abs (3 total)
  {
    name: 'Crunches',
    description: 'Classic crunches for abdominal development',
    category: 'Strength',
    muscleGroup: 'Abs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Leg Raises',
    description: 'Lying leg raises for lower abs',
    category: 'Strength',
    muscleGroup: 'Abs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Russian Twists',
    description: 'Rotational exercise for obliques',
    category: 'Strength',
    muscleGroup: 'Abs',
    isGlobal: true,
    createdBy: 1
  },

  // Core (3 total) - already have Plank, Mountain Climbers, Side Plank

  // Full Body (3 total) - already have Burpees, Tree Pose
  {
    name: 'Deadlift',
    description: 'Deadlift for back and leg muscle development',
    category: 'Strength',
    muscleGroup: 'Full Body',
    isGlobal: true,
    createdBy: 1
  },

  // General Endurance (3 total) - already have Running, Cycling, Jump Rope

  // Additional exercises to reach 30 total
  {
    name: 'Elliptical',
    description: 'Elliptical machine training for endurance development',
    category: 'Cardio',
    muscleGroup: 'General Endurance',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Leg Press',
    description: 'Leg press machine for leg muscle development',
    category: 'Strength',
    muscleGroup: 'Legs',
    isGlobal: true,
    createdBy: 1
  },
  {
    name: 'Burpee with Push-up',
    description: 'Advanced burpee with push-up',
    category: 'Functional',
    muscleGroup: 'Full Body',
    isGlobal: true,
    createdBy: 1
  }
];

async function seedExercises() {
  try {
    await sequelize.authenticate();
    initializeModels(); // Инициализация моделей
    console.log('Database connection established.');

    // Check if global exercises already exist
    const existingGlobalExercises = await Exercise.count({
      where: { isGlobal: true }
    });

    if (existingGlobalExercises > 0) {
      console.log(`Global exercises already exist (${existingGlobalExercises} found). Skipping seed.`);
      return;
    }

    // Create global exercises
    const createdExercises = await Exercise.bulkCreate(globalExercises);
    
    console.log(`Successfully created ${createdExercises.length} global exercises:`);
    
    // Group by category for better display
    const exercisesByCategory = createdExercises.reduce((acc, exercise) => {
      if (!acc[exercise.category]) {
        acc[exercise.category] = [];
      }
      acc[exercise.category].push(exercise);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(exercisesByCategory).forEach(([category, exercises]) => {
      console.log(`\n${category} (${exercises.length}):`);
      exercises.forEach(exercise => {
        console.log(`  - ${exercise.name} (${exercise.muscleGroup})`);
      });
    });

  } catch (error) {
    console.error('Error seeding exercises:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
seedExercises(); 