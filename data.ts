import { Expert, Session, ChartDataPoint, Resource, GroupSession, Conversation } from './types';

export const EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'Olivia Bennett',
    title: 'Mindfulness Coach',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 125,
    tags: ['Meditation', 'Stress', 'Anxiety'],
    price: 120,
    about: 'Certified mindfulness coach with over 10 years of experience helping individuals and teams cultivate presence, reduce stress, and enhance their overall wellbeing.'
  },
  {
    id: '2',
    name: 'Ethan Carter',
    title: 'Fitness & Yoga Instructor',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 98,
    tags: ['Yoga', 'HIIT', 'Strength'],
    price: 95,
    about: 'Dedicated to helping you achieve your physical goals through a balanced approach of strength training and flexibility work.'
  },
  {
    id: '3',
    name: 'Dr. Anya Sharma',
    title: 'Clinical Psychologist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    reviews: 210,
    tags: ['Therapy', 'CBT', 'Relationships'],
    price: 180,
    about: 'Specializing in cognitive behavioral therapy and relationship counseling to help you navigate life\'s challenges.'
  },
  {
    id: '4',
    name: 'Liam Foster',
    title: 'Nutritionist',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviews: 85,
    tags: ['Diet', 'Wellness', 'Health'],
    price: 110,
    about: 'Passionate about food as medicine. Let\'s work together to create a sustainable nutrition plan that fits your lifestyle.'
  },
  {
    id: '5',
    name: 'Sophia Hayes',
    title: 'Corporate Wellbeing Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 150,
    tags: ['Leadership', 'Burnout', 'Culture'],
    price: 200,
    about: 'Helping organizations build resilient teams and foster a culture of wellbeing through strategic workshops and coaching.'
  },
  {
    id: '6',
    name: 'David Lee',
    title: 'Stress Management Consultant',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    reviews: 75,
    tags: ['Stress', 'Resilience', 'Productivity'],
    price: 130,
    about: 'Practical strategies to manage stress and improve productivity in high-pressure environments.'
  }
];

export const UPCOMING_SESSIONS: Session[] = [
  {
    id: 's1',
    expertName: 'Dr. Anya Sharma',
    expertImage: EXPERTS[2].image,
    date: 'July 12, 2024',
    time: '10:00 AM',
    type: 'Mindfulness Meditation',
    status: 'upcoming'
  },
  {
    id: 's2',
    expertName: 'Ethan Carter',
    expertImage: EXPERTS[1].image,
    date: 'July 15, 2024',
    time: '2:00 PM',
    type: 'Yoga for Beginners',
    status: 'upcoming'
  }
];

export const PAST_SESSIONS: Session[] = [
  {
    id: 's3',
    expertName: 'Olivia Bennett',
    expertImage: EXPERTS[0].image,
    date: 'June 28, 2024',
    time: '4:00 PM',
    type: 'Stress Management',
    status: 'completed'
  }
];

export const REVENUE_DATA: ChartDataPoint[] = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const ENGAGEMENT_DATA: ChartDataPoint[] = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 150 },
  { name: 'Wed', value: 180 },
  { name: 'Thu', value: 140 },
  { name: 'Fri', value: 160 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 70 },
];

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'The Science of Happiness: Practical Tips',
    category: 'Mental Health',
    type: 'Article',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    duration: '5 min read',
    author: 'Dr. Anya Sharma'
  },
  {
    id: '2',
    title: '10-Minute Morning Yoga Flow',
    category: 'Fitness',
    type: 'Video',
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400',
    duration: '10 min',
    author: 'Ethan Carter'
  },
  {
    id: '3',
    title: 'Guided Meditation for Deep Sleep',
    category: 'Sleep',
    type: 'Audio',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400',
    duration: '20 min',
    author: 'Olivia Bennett'
  },
  {
    id: '4',
    title: 'Nutrition Basics for Energy',
    category: 'Nutrition',
    type: 'Article',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400',
    duration: '7 min read',
    author: 'Liam Foster'
  }
];

export const GROUP_SESSIONS: GroupSession[] = [
  {
    id: 'gs1',
    title: 'Mindfulness Meditation Group',
    expertName: 'Dr. Anya Sharma',
    expertImage: EXPERTS[2].image,
    date: 'Wed, Jul 15',
    time: '6:00 PM',
    price: 25,
    attendees: 12,
    maxAttendees: 20,
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=600',
    tags: ['Meditation', 'Beginner Friendly']
  },
  {
    id: 'gs2',
    title: 'Full Body HIIT Workout',
    expertName: 'Ethan Carter',
    expertImage: EXPERTS[1].image,
    date: 'Thu, Jul 16',
    time: '5:30 PM',
    price: 15,
    attendees: 18,
    maxAttendees: 30,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
    tags: ['Fitness', 'High Intensity']
  },
  {
    id: 'gs3',
    title: 'Nutrition Masterclass: Meal Prep',
    expertName: 'Liam Foster',
    expertImage: EXPERTS[3].image,
    date: 'Sat, Jul 18',
    time: '11:00 AM',
    price: 30,
    attendees: 8,
    maxAttendees: 15,
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
    tags: ['Nutrition', 'Workshop']
  }
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    contactName: 'Dr. Anya Sharma',
    contactImage: EXPERTS[2].image,
    lastMessage: 'Looking forward to our session tomorrow!',
    timestamp: '10:30 AM',
    unread: 1,
    role: 'Expert'
  },
  {
    id: 'c2',
    contactName: 'Ethan Carter',
    contactImage: EXPERTS[1].image,
    lastMessage: 'Here is the yoga plan we discussed.',
    timestamp: 'Yesterday',
    unread: 0,
    role: 'Expert'
  }
];