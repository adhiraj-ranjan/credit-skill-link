
import { StudentProfile } from '@/types';

// Convert data from database format to our StudentProfile type
export const convertDbDataToProfile = (data: any): StudentProfile => {
  return {
    id: data.id,
    fullName: data.full_name || '',
    collegeName: data.college_name || '',
    course: data.course || '',
    degree: data.degree || '',
    address: data.address || '',
    hackathonParticipation: data.hackathon_participation || 0,
    hackathonWins: data.hackathon_wins || 0,
    hackathonDetails: data.hackathon_details || [],
    cgpa: data.cgpa || 0,
    degreeCompleted: data.degree_completed || false,
    certifications: data.certifications || [],
    achievements: data.achievements || [],
    researchPapers: data.research_papers || [],
    projects: data.projects || [],
    profileImage: data.profile_image || '',
  };
};

// Convert our StudentProfile type to database format
export const convertProfileToDbData = (profile: StudentProfile): any => {
  return {
    id: profile.id,
    full_name: profile.fullName,
    college_name: profile.collegeName,
    course: profile.course,
    degree: profile.degree,
    address: profile.address,
    hackathon_participation: profile.hackathonParticipation,
    hackathon_wins: profile.hackathonWins,
    hackathon_details: profile.hackathonDetails || [],
    cgpa: profile.cgpa,
    degree_completed: profile.degreeCompleted,
    certifications: profile.certifications || [],
    achievements: profile.achievements || [],
    research_papers: profile.researchPapers || [],
    projects: profile.projects || [],
    profile_image: profile.profileImage || '',
  };
};
