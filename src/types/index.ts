export interface CompanySettings {
  businessName: string;
  tagline: string;
  slogan: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  whatsappCommunityUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  published: boolean;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  items: string[];
  image: string;
  popular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  completionDate?: string;
  clientType?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image?: string;
  isPlaceholder?: boolean;
}

export interface PollData {
  id: string;
  question: string;
  description: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
}

export interface ServiceRequestSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  phoneOrEmail: string;
  serviceCategory: string;
  serviceItem: string;
  details: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TrainingRegistrationSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  preferredSchedule: string;
  status: 'new' | 'contacted' | 'enrolled';
}

export interface ContactMessageSubmission {
  id: string;
  timestamp: string;
  name: string;
  contact: string;
  serviceInterest: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  category: 'Printing & Binding' | 'Computer Training' | 'Event & Stationery' | 'Typing & Data Entry' | 'Design & Branding';
  serviceUsed: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
  avatarInitials: string;
  tag?: string;
  location?: string;
}
