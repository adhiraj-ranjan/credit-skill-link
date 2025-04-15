
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
  profileImage?: string;
  creditScore?: number;
  projects?: Project[];
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

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  ongoing: boolean;
}
