import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PricingPlan from '../models/PricingPlan';
import logger from '../utils/logger';

dotenv.config();

const pricingPlans = [
  // Individual Plans
  {
    name: 'Pay As You Go',
    type: 'individual',
    category: 'pay_as_you_go',
    price: 80,
    currency: 'USD',
    sessions: 1,
    pricePerSession: 80,
    discount: 0,
    savings: 0,
    features: [
      '50-minute therapy session',
      'Licensed mental health professional',
      'Video or phone session',
      'Session notes included',
      'Flexible scheduling',
      'No commitment required',
    ],
    popular: false,
    bestValue: false,
    description:
      'Perfect for trying out therapy or occasional support. Pay only when you need it with no ongoing commitment.',
    shortDescription: 'Single session with flexible scheduling',
    isActive: true,
  },
  {
    name: 'Starter Package',
    type: 'individual',
    category: 'starter',
    price: 280,
    currency: 'USD',
    sessions: 4,
    pricePerSession: 70,
    discount: 12.5,
    savings: 40,
    features: [
      '4 therapy sessions (50 minutes each)',
      'Licensed mental health professional',
      'Video or phone sessions',
      'AI Companion access',
      'Mood tracking & journaling',
      'Session notes & progress tracking',
      'Flexible scheduling',
      'Valid for 60 days',
    ],
    popular: false,
    bestValue: false,
    description:
      'Ideal for addressing specific concerns like anxiety, stress, or life transitions. Research shows 4 sessions can provide significant relief for acute issues.',
    shortDescription: 'Quick relief for specific concerns',
    isActive: true,
  },
  {
    name: 'Progress Package',
    type: 'individual',
    category: 'progress',
    price: 520,
    currency: 'USD',
    sessions: 8,
    pricePerSession: 65,
    discount: 18.75,
    savings: 120,
    features: [
      '8 therapy sessions (50 minutes each)',
      'Licensed mental health professional',
      'Video or phone sessions',
      'AI Companion access',
      'Mood tracking & journaling',
      'Progress analytics dashboard',
      'Session notes & homework assignments',
      'Email support between sessions',
      'Flexible scheduling',
      'Valid for 90 days',
    ],
    popular: true,
    bestValue: false,
    description:
      'The most effective package based on clinical research. 8 sessions of CBT therapy provide lasting change for anxiety, depression, and relationship issues.',
    shortDescription: 'Evidence-based package for lasting change',
    isActive: true,
  },
  {
    name: 'Commitment Package',
    type: 'individual',
    category: 'commitment',
    price: 720,
    currency: 'USD',
    sessions: 12,
    pricePerSession: 60,
    discount: 25,
    savings: 240,
    features: [
      '12 therapy sessions (50 minutes each)',
      'Licensed mental health professional',
      'Video or phone sessions',
      'AI Companion access',
      'Mood tracking & journaling',
      'Comprehensive progress analytics',
      'Session notes & personalized treatment plan',
      'Email support between sessions',
      'Priority scheduling',
      'Flexible rescheduling',
      'Valid for 120 days',
    ],
    popular: false,
    bestValue: true,
    description:
      'Best for chronic conditions, trauma, or deep personal growth. Comprehensive support for meaningful transformation with the best per-session value.',
    shortDescription: 'Deep transformation with best value',
    isActive: true,
  },

  // Subscription Plan
  {
    name: 'Unlimited Messaging + AI',
    type: 'subscription',
    category: 'messaging',
    price: 49,
    currency: 'USD',
    sessions: 0,
    pricePerSession: 0,
    discount: 0,
    savings: 0,
    duration: 30,
    features: [
      '24/7 AI Companion access',
      'Unlimited AI conversations',
      'Crisis detection & resources',
      'Mood tracking & analytics',
      'Digital journaling with AI insights',
      'Wellness challenges',
      'Content library access',
      'Email notifications',
      'No therapy sessions included',
    ],
    popular: false,
    bestValue: false,
    description:
      '24/7 mental health support through our AI companion. Perfect for ongoing support between therapy sessions or as a standalone wellness tool.',
    shortDescription: '24/7 AI support without therapy sessions',
    isActive: true,
  },

  // Corporate Plans
  {
    name: 'Starter (10-50 employees)',
    type: 'corporate',
    category: 'basic',
    price: 180,
    currency: 'USD',
    sessions: 0,
    pricePerSession: 0,
    discount: 0,
    savings: 0,
    duration: 365,
    minEmployees: 10,
    maxEmployees: 50,
    creditsIncluded: 160,
    features: [
      '2 therapy sessions per employee per year',
      'AI Companion access for all employees',
      'Basic admin dashboard',
      'Employee wellness metrics (anonymized)',
      'Email support',
      'Monthly usage reports',
      'Flexible credit allocation',
      '$15/employee/month',
    ],
    popular: false,
    bestValue: false,
    description:
      'Perfect for small teams starting their wellness journey. Provide mental health support with measurable ROI and anonymized insights.',
    shortDescription: 'Entry-level wellness for small teams',
    isActive: true,
  },
  {
    name: 'Growth (51-200 employees)',
    type: 'corporate',
    category: 'growth',
    price: 144,
    currency: 'USD',
    sessions: 0,
    pricePerSession: 0,
    discount: 20,
    savings: 36,
    duration: 365,
    minEmployees: 51,
    maxEmployees: 200,
    creditsIncluded: 240,
    features: [
      '3 therapy sessions per employee per year',
      'AI Companion access for all employees',
      'Advanced admin dashboard',
      'Department-level analytics',
      'Wellness trend reports',
      'Priority email support',
      'Quarterly wellness reports',
      'Custom branding options',
      'Flexible credit allocation',
      '$12/employee/month',
    ],
    popular: true,
    bestValue: false,
    description:
      'Ideal for growing companies. Enhanced analytics, priority support, and more sessions per employee with volume pricing.',
    shortDescription: 'Enhanced support for growing teams',
    isActive: true,
  },
  {
    name: 'Enterprise (201+ employees)',
    type: 'corporate',
    category: 'enterprise',
    price: 120,
    currency: 'USD',
    sessions: 0,
    pricePerSession: 0,
    discount: 33.33,
    savings: 60,
    duration: 365,
    minEmployees: 201,
    creditsIncluded: 320,
    features: [
      '4 therapy sessions per employee per year',
      'AI Companion access for all employees',
      'Full-featured admin dashboard',
      'Dedicated account manager',
      'Phone + email support',
      'Monthly business reviews',
      'Custom integrations (HRIS, SSO)',
      'White-label options',
      'On-site wellness events',
      'Quarterly executive reports',
      'API access',
      'Flexible credit allocation',
      '$10/employee/month',
    ],
    popular: false,
    bestValue: true,
    description:
      'Comprehensive wellness solution for large organizations. Maximum value with dedicated support, custom integrations, and executive insights.',
    shortDescription: 'Complete enterprise wellness solution',
    isActive: true,
  },
];

async function seedPricing() {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/serene-wellbeing'
    );
    logger.info('Connected to MongoDB');

    // Clear existing pricing plans
    await PricingPlan.deleteMany({});
    logger.info('Cleared existing pricing plans');

    // Insert new pricing plans
    const inserted = await PricingPlan.insertMany(pricingPlans);
    logger.info(`Inserted ${inserted.length} pricing plans`);

    logger.info('✓ Pricing plans seeded successfully!');

    // Display summary
    console.log('\n=== PRICING PLANS SUMMARY ===\n');

    console.log('INDIVIDUAL PLANS:');
    const individual = inserted.filter((p) => p.type === 'individual');
    individual.forEach((p) => {
      console.log(
        `  ${p.popular ? '⭐' : p.bestValue ? '💎' : '  '} ${p.name}: $${
          p.price
        } (${p.sessions} sessions @ $${p.pricePerSession}/session)`
      );
    });

    console.log('\nSUBSCRIPTION PLANS:');
    const subscription = inserted.filter((p) => p.type === 'subscription');
    subscription.forEach((p) => {
      console.log(`  ${p.name}: $${p.price}/month`);
    });

    console.log('\nCORPORATE PLANS:');
    const corporate = inserted.filter((p) => p.type === 'corporate');
    corporate.forEach((p) => {
      console.log(
        `  ${p.popular ? '⭐' : p.bestValue ? '💎' : '  '} ${p.name}: $${
          p.price
        }/employee/year ($${(p.price / 12).toFixed(2)}/month)`
      );
    });

    console.log('\n=============================\n');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding pricing plans:', error);
    process.exit(1);
  }
}

seedPricing();
