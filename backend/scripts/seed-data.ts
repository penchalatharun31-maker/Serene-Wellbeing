import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import User from '../src/models/User';
import Expert from '../src/models/Expert';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/serene-wellbeing';

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    credits: 500,
  },
  {
    name: 'Jane Smith',
    email: 'user2@example.com',
    password: 'password123',
    role: 'user',
    credits: 1000,
  },
];

const sampleExperts = [
  {
    name: 'Dr. Olivia Bennett',
    email: 'olivia@example.com',
    password: 'password123',
    role: 'expert',
    expertData: {
      title: 'Clinical Psychologist & Mindfulness Coach',
      specialization: ['Anxiety', 'Depression', 'Stress Management', 'Mindfulness', 'CBT'],
      bio: 'Certified clinical psychologist with over 10 years of experience helping individuals navigate life\'s challenges. I specialize in cognitive behavioral therapy, mindfulness-based stress reduction, and anxiety management. My approach is warm, evidence-based, and tailored to your unique needs.',
      experience: 10,
      hourlyRate: 2500,
      languages: ['English', 'Hindi'],
      qualifications: ['PhD in Clinical Psychology', 'Licensed Therapist', 'Mindfulness-Based Stress Reduction Certified'],
      personalStory: 'After experiencing burnout in my corporate career, I discovered the transformative power of therapy and mindfulness. This personal journey inspired me to help others find their path to wellbeing.',
    },
  },
  {
    name: 'Ethan Carter',
    email: 'ethan@example.com',
    password: 'password123',
    role: 'expert',
    expertData: {
      title: 'Certified Yoga Instructor & Wellness Coach',
      specialization: ['Yoga', 'Fitness', 'Meditation', 'Holistic Health', 'Stress Relief'],
      bio: 'RYT-500 certified yoga instructor passionate about helping people discover the mind-body connection. Whether you\'re a complete beginner or experienced practitioner, I create personalized sequences that honor your body and support your goals.',
      experience: 6,
      hourlyRate: 1500,
      languages: ['English', 'Hindi', 'Tamil'],
      qualifications: ['RYT-500 Yoga Alliance', 'Meditation Teacher Training', 'Sports Nutrition Certification'],
      personalStory: 'Yoga transformed my life after a sports injury. Now I help others find strength, flexibility, and peace through mindful movement.',
    },
  },
  {
    name: 'Dr. Anya Sharma',
    email: 'anya@example.com',
    password: 'password123',
    role: 'expert',
    expertData: {
      title: 'Relationship Counselor & Family Therapist',
      specialization: ['Couples Therapy', 'Family Counseling', 'Communication', 'Conflict Resolution', 'Emotional Intelligence'],
      bio: 'Specialized in helping couples and families build stronger connections. Using evidence-based approaches like Emotionally Focused Therapy and Gottman Method, I create a safe space for healing and growth. Every relationship has the potential to thrive.',
      experience: 8,
      hourlyRate: 3000,
      languages: ['English', 'Hindi', 'Marathi'],
      qualifications: ['MA in Marriage & Family Therapy', 'Licensed Clinical Social Worker', 'Gottman Method Level 2'],
      clientSuccessStories: [
        'Helped us save our marriage after years of conflict - we now communicate with love and respect.',
        'Transformed our family dynamics. We finally understand each other.',
      ],
    },
  },
  {
    name: 'Liam Foster',
    email: 'liam@example.com',
    password: 'password123',
    role: 'expert',
    expertData: {
      title: 'Nutritionist & Wellness Expert',
      specialization: ['Nutrition', 'Weight Management', 'Sports Nutrition', 'Gut Health', 'Preventive Health'],
      bio: 'Registered dietitian helping clients build sustainable, healthy relationships with food. No fad diets or restrictions - just evidence-based nutrition that fits your lifestyle and goals. Let\'s create a personalized plan that nourishes your body and mind.',
      experience: 5,
      hourlyRate: 1800,
      languages: ['English', 'Hindi'],
      qualifications: ['MSc in Clinical Nutrition', 'Registered Dietitian', 'Sports Nutrition Specialist'],
    },
  },
  {
    name: 'Sophia Hayes',
    email: 'sophia@example.com',
    password: 'password123',
    role: 'expert',
    expertData: {
      title: 'Corporate Wellness & Burnout Prevention Specialist',
      specialization: ['Workplace Stress', 'Burnout Prevention', 'Leadership Coaching', 'Work-Life Balance', 'Team Wellness'],
      bio: 'Former corporate executive turned wellness specialist. I understand the unique challenges of high-pressure work environments and help professionals prevent burnout while excelling in their careers. Expertise in creating sustainable wellbeing practices for leaders and teams.',
      experience: 12,
      hourlyRate: 3500,
      languages: ['English'],
      qualifications: ['ICF Certified Executive Coach', 'MBA', 'Workplace Wellbeing Certification'],
      corporateExperience: 15,
      workshopTopics: ['Preventing Leadership Burnout', 'Building Resilient Teams', 'Stress Management for Executives'],
    },
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    console.log(`📦 Connecting to MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Expert.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👤 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        isActive: true,
        emailVerified: true,
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.email}`);
    }

    // Create experts with users
    console.log('🎓 Creating sample experts...');
    for (const expertData of sampleExperts) {
      const hashedPassword = await bcrypt.hash(expertData.password, 12);

      // Create user account for expert
      const user = await User.create({
        name: expertData.name,
        email: expertData.email,
        password: hashedPassword,
        role: expertData.role,
        isActive: true,
        emailVerified: true,
      });

      // Create expert profile
      const expert = await Expert.create({
        userId: user._id,
        title: expertData.expertData.title,
        specialization: expertData.expertData.specialization,
        bio: expertData.expertData.bio,
        experience: expertData.expertData.experience,
        hourlyRate: expertData.expertData.hourlyRate,
        languages: expertData.expertData.languages,
        qualifications: expertData.expertData.qualifications,
        personalStory: expertData.expertData.personalStory,
        clientSuccessStories: expertData.expertData.clientSuccessStories || [],
        corporateExperience: expertData.expertData.corporateExperience,
        workshopTopics: expertData.expertData.workshopTopics || [],
        isApproved: true,
        isAcceptingClients: true,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviewCount: Math.floor(Math.random() * 100) + 20, // 20-120 reviews
      });

      console.log(`   ✓ Created expert: ${user.email} (${expert.title})`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Experts: ${sampleExperts.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Regular User: user@example.com / password123');
    console.log('   Expert: olivia@example.com / password123');
    console.log('\n✨ You can now test the full B2C flow!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
