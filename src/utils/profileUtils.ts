
import { Json } from '@/integrations/supabase/types';
import { StudentProfile, HackathonDetail, Certification, Achievement, ResearchPaper } from '@/types';

/**
 * Safely convert Supabase JSON data to strongly typed arrays
 */
export const convertJsonToTypedArray = <T>(data: Json | null | undefined): T[] => {
  if (!data) return [];
  
  try {
    // If it's already an array, attempt to cast it
    if (Array.isArray(data)) {
      // Use as unknown first then cast to T[]
      return data as unknown as T[];
    }
    return [];
  } catch (error) {
    console.error('Error converting JSON to typed array:', error);
    return [];
  }
};

/**
 * Convert JSON data from Supabase to StudentProfile type
 */
export const convertDbDataToProfile = (data: any): StudentProfile => {
  if (!data) {
    console.warn("No profile data provided to convert");
    return {
      id: '',
      fullName: '',
      collegeName: '',
      course: '',
      degree: '',
      address: '',
      hackathonParticipation: 0,
      hackathonWins: 0,
      hackathonDetails: [],
      cgpa: 0,
      degreeCompleted: false,
      certifications: [],
      achievements: [],
      researchPapers: [],
      profileImage: ''
    };
  }
  
  return {
    id: data.id,
    fullName: data.full_name || '',
    collegeName: data.college_name || '',
    course: data.course || '',
    degree: data.degree || '',
    address: data.address || '',
    hackathonParticipation: data.hackathon_participation || 0,
    hackathonWins: data.hackathon_wins || 0,
    hackathonDetails: convertJsonToTypedArray<HackathonDetail>(data.hackathon_details),
    cgpa: data.cgpa || 0,
    degreeCompleted: data.degree_completed || false,
    certifications: convertJsonToTypedArray<Certification>(data.certifications),
    achievements: convertJsonToTypedArray<Achievement>(data.achievements),
    researchPapers: convertJsonToTypedArray<ResearchPaper>(data.research_papers),
    profileImage: data.profile_image || ''
  };
};

/**
 * Convert profile data to Supabase DB format
 */
export const convertProfileToDbData = (profile: Partial<StudentProfile>) => {
  return {
    id: profile.id,
    full_name: profile.fullName,
    college_name: profile.collegeName,
    course: profile.course,
    degree: profile.degree,
    address: profile.address,
    hackathon_participation: profile.hackathonParticipation,
    hackathon_wins: profile.hackathonWins,
    hackathon_details: profile.hackathonDetails as unknown as Json,
    cgpa: profile.cgpa,
    degree_completed: profile.degreeCompleted,
    certifications: profile.certifications as unknown as Json,
    achievements: profile.achievements as unknown as Json,
    research_papers: profile.researchPapers as unknown as Json,
    profile_image: profile.profileImage,
    updated_at: new Date().toISOString()
  };
};
