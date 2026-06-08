export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface PersonalInfo {
  label: string;
  value: string;
  icon: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  period: string;
  company: string;
  role: string;
  location: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  projects: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  featured: boolean;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  date: string;
  image: string;
  credentialUrl?: string;
  downloadUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

export interface PortfolioData {
  profile: {
    name: string;
    designation: string;
    tagline: string;
    introduction: string;
    avatar: string;
    resumeUrl: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    social: SocialLink[];
  };
  stats: Stat[];
  about: {
    summary: string;
    journey: TimelineItem[];
    education: TimelineItem[];
    personalInfo: PersonalInfo[];
    achievements: string[];
  };
  skillCategories: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  services: Service[];
  blog: BlogPost[];
  contact: {
    mapEmbed: string;
    formEndpoint: string;
  };
  analytics: {
    pageViews: number;
    uniqueVisitors: number;
    avgSession: string;
    bounceRate: number;
    topProjects: { name: string; views: number }[];
    trafficSources: { source: string; percentage: number }[];
    monthlyViews: number[];
  };
}
