
export interface StudentProfile {
  id: string;
  fullName: string;
  collegeName: string;
  course: string;
  degree: string;
  address: string;
  hackathonParticipation: number;
  hackathonWins: number;
  hackathonDetails?: HackathonDetail[];
  cgpa: number;
  degreeCompleted: boolean;
  certifications: Certification[];
  achievements: Achievement[];
  researchPapers: ResearchPaper[];
  projects: Project[];
  profileImage?: string;
  creditScore?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  url: string;
}

export interface HackathonDetail {
  id: string;
  name: string;
  date: string;
  position?: string;
  won: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
}

export interface CreditScoreResponse {
  id: number;
  score: number;
  breakdown: {
    hackathon: number;
    academic: number;
    certifications: number;
    research: number;
    extras: number;
  };
}
