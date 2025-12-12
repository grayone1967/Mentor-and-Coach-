
import React from 'react';

export enum ViewState {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES', // Legacy/General
  COURSE_LIST = 'COURSE_LIST', // Specific for Create Sidebar
  COURSE_CREATE = 'COURSE_CREATE', // Specific for Create Sidebar
  CLIENTS = 'CLIENTS',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  COURSE_BUILDER = 'COURSE_BUILDER',
  LIBRARY = 'LIBRARY',
  MESSAGING = 'MESSAGING',
  RED_FLAGS = 'RED_FLAGS'
}

export enum UserRole {
  PRACTITIONER = 'PRACTITIONER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum SuperAdminViewState {
  DASHBOARD = 'DASHBOARD',
  PRACTITIONERS = 'PRACTITIONERS',
  USERS = 'USERS',
  LIBRARY = 'LIBRARY',
  PERSONAS = 'PERSONAS',
  ANALYTICS = 'ANALYTICS',
  MODERATION = 'MODERATION',
  COMPLIANCE = 'COMPLIANCE',
  FINANCE = 'FINANCE'
}

export interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  streak: number;
  lastActive: string;
  status: 'Active' | 'Warning' | 'Critical';
}

export type TaskType = 'Daily Check-in' | 'Journaling' | 'Reflection' | 'Lesson' | 'AI Conversation';

export interface Resource {
  id: string;
  title: string;
  type: 'Audio' | 'Video' | 'PDF' | 'Text';
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  description: string;
  // AI Config
  objective?: string;
  context?: string;
  coachNotes?: string;
  aiInstructions?: string;
  // Resources
  resources?: Resource[];
}

export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  overview: string;
  objectives: string[];
  tasks: Task[];
  isExpanded?: boolean;
}

// --- Persona Types ---

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  tags: string[]; // Related Courses/Tags
  toneStyle: string[]; // e.g. 'Empathetic', 'Direct'
  responseStyle: 'Concise' | 'Detailed' | 'Conversational' | 'Socratic';
  systemPrompt: string;
  examplePhrases: string[];
  activeUsers?: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  duration: string;
  durationValue?: number;
  durationUnit?: 'Weeks' | 'Months';
  enrolled: number;
  status: 'Published' | 'Draft' | 'Archived';
  creationStage: number; // 1-6
  revenue: string;
  image: string;
  tags?: string[];
  weeks?: Week[];
  personas?: Persona[];
  
  // Pricing & Publication
  pricingModel?: 'Free' | 'OneTime' | 'Subscription';
  price?: number;
  trialEnabled?: boolean;
  trialDays?: number;
  maxEnrollments?: number;
  startDate?: string;
}

// --- Material Types ---

export type MaterialType = 'Audio' | 'Video' | 'PDF' | 'Text';

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  category: string[];
  duration?: string; // MM:SS for Audio/Video
  source: 'My Files' | 'Global';
  usageCount: number;
  dateAdded: string;
  url?: string;
  tags?: string[];
  
  // Admin Fields
  status?: 'Approved' | 'Pending' | 'Rejected';
  uploadedBy?: string; // Practitioner Name
  isFeatured?: boolean;
}

// --- Alert Types ---

export interface Alert {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  courseName: string;
  week: string; // e.g. "Week 4"
  severity: 'Critical' | 'Warning' | 'Resolved';
  issue: string; // "Severe distress language detected"
  timestamp: string; // "2 hours ago" or absolute date
  context: string; // Detailed description
  status: 'Pending' | 'Reviewed' | 'Resolved';
  suggestedActions: string[];
}

// --- Super Admin Types ---

export interface AdminPractitioner {
  id: string;
  name: string;
  avatar: string;
  businessName: string;
  niche: string;
  coursesCount: number;
  clientsCount: number;
  status: 'Active' | 'Pending' | 'Suspended' | 'Inactive';
  joinedDate: string;
  revenue: string;
}

export interface EndUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  practitionerName: string;
  courseName: string;
  progress: number;
  lastActive: string;
  status: 'Active' | 'Churned' | 'Flagged';
  registrationDate: string;
  paymentHistory: { id: string; date: string; amount: string; invoiceId: string }[];
  supportTickets: { id: string; subject: string; status: 'Open' | 'Resolved' | 'Closed'; date: string }[];
}

export interface ModerationItem {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  type: 'Video' | 'Message' | 'Content';
  reason: string;
  reportedBy: string;
  target: string; // Practitioner or User name
  timestamp: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
}
