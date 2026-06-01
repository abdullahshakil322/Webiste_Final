export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string; // Lucide icon key
  ctaText?: string;
}

export interface Industry {
  name: string;
  description: string;
  icon: string; // Lucide icon key
}

export interface WhyChooseReason {
  title: string;
  description: string;
}

export interface AMCFeature {
  title: string;
  description: string;
  icon: string; // Lucide icon key
}

export interface ProjectExample {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  location: string;
  badge: 'Completed' | 'In Progress' | 'Maintenance';
  scope: string[];
}

export interface ClientReview {
  id: string;
  name: string;
  company: string;
  industry: string;
  review: string;
  rating: number;
}

export interface QuoteRequest {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  services: string[];
  scale: string;
  notes: string;
}

export interface InquiryData {
  id: string;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Pending' | 'Completed';
}
