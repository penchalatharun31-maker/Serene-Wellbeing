export interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  price: number;
  about: string;
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