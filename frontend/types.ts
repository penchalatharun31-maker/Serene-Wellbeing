export type ExpertCategory =
  // Mental Health
  | 'Psychologist' | 'Psychiatrist' | 'Clinical Psychologist' | 'Therapist' | 'Marriage & Family Therapist'
  | 'Art/Music Therapist' | 'Psychiatric Nurse'
  // Coaching
  | 'Life Coach' | 'Career Coach' | 'Executive Coach' | 'Leadership Coach' | 'Business Coach'
  | 'Relationship Coach' | 'Parenting Coach' | 'Financial Wellness Coach'
  // Holistic Wellness
  | 'Yoga Instructor' | 'Meditation Guide' | 'Breathwork Coach' | 'Sound Healer'
  | 'Ayurveda Expert' | 'Reiki Master' | 'Wellness Coach'
  // Physical Wellness
  | 'Fitness Coach' | 'Personal Trainer' | 'Physiotherapist' | 'Sports Psychologist' | 'Sleep Specialist'
  // Nutrition
  | 'Nutritionist' | 'Dietitian' | 'Holistic Nutritionist' | 'Gut Health Expert'
  // Corporate/B2B
  | 'POSH Trainer' | 'DEI Facilitator' | 'EAP Counselor' | 'Stress Workshop Expert' | 'Team Building Facilitator';

export interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  category: ExpertCategory;
  rating: number;
  reviews: number;
  tags: string[];
  price: number;
  country?: string;
  currency?: string;
  about: string;
  experience?: string;

  // TIER 1 & 2: Baseline & Matching
  profilePhoto?: string;
  qualifications?: string[];
  specializations?: string[];
  populationsServed?: string[];
  therapeuticApproaches?: string[];
  languages?: string[];
  sessionFormats?: ('Video' | 'Audio' | 'Chat' | 'In-person')[];

  // TIER 3: Differentiators
  videoIntroUrl?: string;
  personalStory?: string;
  signatureApproach?: string;
  firstSessionPreview?: string;
  clientSuccessStories?: { archetype: string; challenge: string; outcome: string; sessions: number }[];
  notWorkingWith?: string;

  // Personality Profile (1-10 Slider Scales)
  personalityProfile?: {
    communicationStyle: number; // Warm/Nurturing vs Direct/Challenging
    sessionStructure: number; // Free-flowing vs Highly Structured
    approachFocus: number; // Past/Root vs Present/Future
    energyLevel: number; // Calm/Reflective vs Energizing/Motivating
    humorLevel: number; // Serious/Formal vs Lighthearted/Playful
  };

  // Identity & Cultural
  identityAffirmations?: string[]; // LGBTQ+, BIPOC, etc.
  culturalContext?: string;

  // TIER 4: B2B / Corporate
  corporateExperience?: number;
  clientLogos?: string[];
  workshopTopics?: string[];
  groupSessionCapacity?: number;
  certifications?: string[];
  bgvCompleted?: boolean;
  hasInsurance?: boolean;
  gstNumber?: string;
  corporateRateCard?: string;
  availableForEAP?: boolean;

  // TIER 5: Integration
  calLink?: string;
  bankDetails?: { accountName: string; accountNum: string; ifsc: string };
  panNumber?: string;
  cancellationPolicy?: string;
}

export interface Session {
  id: string;
  expertName: string;
  expertImage: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'expert' | 'company' | 'super_admin';
  avatar?: string;
  credits?: number;
  country?: string;
  currency?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  type: 'Article' | 'Video' | 'Audio';
  image: string;
  duration: string;
  author: string;
}

export interface GroupSession {
  id: string;
  title: string;
  expertName: string;
  expertImage: string;
  date: string;
  time: string;
  price: number;
  attendees: number;
  maxAttendees: number;
  image: string;
  tags: string[];
}

export interface Conversation {
  id: string;
  contactName: string;
  contactImage: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  role: string;
}

export interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: string;
}
