
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
import { convertDbDataToProfile } from '@/utils/profileUtils';

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
          
          // Transform DB data to our StudentProfile type using the utility function
          const profileData = convertDbDataToProfile(data);
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
            
            // Update to use the correct response format: credit_score instead of credit-score
            const creditScoreData: CreditScoreResponse = {
              id: studentId,
              score: scoreData['credit_score'] || 0,
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
