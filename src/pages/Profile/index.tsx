
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { StudentProfile, CreditScoreResponse } from '@/types';
import ProfileLayout from './components/ProfileLayout';
import ProfileHeader from './components/ProfileHeader';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileContent from './components/ProfileContent';
import { Json } from '@/integrations/supabase/types';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResponse | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          console.log('Profile data received:', data);
          
          // Transform DB data to our StudentProfile type with proper type assertions
          const profileData: StudentProfile = {
            id: data.id,
            fullName: data.full_name || '',
            collegeName: data.college_name || '',
            course: data.course || '',
            degree: data.degree || '',
            address: data.address || '',
            hackathonParticipation: data.hackathon_participation || 0,
            hackathonWins: data.hackathon_wins || 0,
            // Properly cast Json types to our interface types
            hackathonDetails: (data.hackathon_details as unknown as StudentProfile['hackathonDetails']) || [],
            cgpa: data.cgpa || 0,
            degreeCompleted: data.degree_completed || false,
            certifications: (data.certifications as unknown as StudentProfile['certifications']) || [],
            achievements: (data.achievements as unknown as StudentProfile['achievements']) || [],
            researchPapers: (data.research_papers as unknown as StudentProfile['researchPapers']) || [],
            profileImage: data.profile_image || ''
          };
          
          setProfile(profileData);
          console.log('Profile transformed:', profileData);
          
          // Fetch credit score
          try {
            const studentId = parseInt(user.id, 36) % 10000; // Convert UUID to a numeric ID
            console.log('Fetching credit score for student ID:', studentId);
            const scoreResponse = await fetch(`https://skillcredit.pythonanywhere.com/get-score/${studentId}`);
            
            if (!scoreResponse.ok) {
              console.error('Failed to fetch credit score:', await scoreResponse.text());
              throw new Error('Failed to fetch credit score');
            }
            
            const scoreData = await scoreResponse.json();
            console.log('Credit score data:', scoreData);
            
            // Update to use the correct response format
            const creditScoreData: CreditScoreResponse = {
              id: studentId,
              score: scoreData['credit-score'] || 0,
              breakdown: {
                hackathon: scoreData.breakdown?.hackathon || 0,
                academic: scoreData.breakdown?.academic || 0,
                certifications: scoreData.breakdown?.certifications || 0,
                research: scoreData.breakdown?.research || 0,
                extras: scoreData.breakdown?.extras || 0,
              }
            };
            
            setCreditScore(creditScoreData);
          } catch (scoreError) {
            console.error('Error fetching credit score:', scoreError);
            toast.error('Could not load credit score. Please try again later.');
          }
        } else {
          // No profile found, redirect to setup
          console.log('No profile found, redirecting to setup');
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Error in profile fetching:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
          <p className="mt-4 text-skill-darkGray">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will be redirected in useEffect
  }

  return (
    <ProfileLayout>
      <ProfileHeader profile={profile} onEditClick={() => navigate('/profile-setup')} onLogout={signOut} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileContent profile={profile} />
        <ProfileSidebar creditScore={creditScore} />
      </div>
    </ProfileLayout>
  );
};

export default Profile;
