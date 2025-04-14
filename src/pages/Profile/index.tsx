
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { StudentProfile, CreditScoreResponse, Project } from '@/types';
import ProfileLayout from './components/ProfileLayout';
import ProfileHeader from './components/ProfileHeader';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileContent from './components/ProfileContent';
import ProjectDialog from './components/ProjectDialog';
import { convertDbDataToProfile, convertProfileToDbData } from '@/utils/profileUtils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [creditScore, setCreditScore] = useState<CreditScoreResponse | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching profile for user:', user.id);
      
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
        
        const profileData = convertDbDataToProfile(data);
        
        if (!profileData.projects) {
          profileData.projects = [];
        }
        
        setProfile(profileData);
        // Initialize pendingProjects with the current projects
        setPendingProjects(profileData.projects);
        console.log('Profile transformed:', profileData);
        
        try {
          const studentId = parseInt(user.id, 36) % 10000;
          console.log('Fetching credit score for student ID:', studentId);
          const scoreResponse = await fetch(`https://skillcredit.pythonanywhere.com/get-score/${studentId}`);
          
          if (!scoreResponse.ok) {
            console.error('Failed to fetch credit score:', await scoreResponse.text());
            throw new Error('Failed to fetch credit score');
          }
          
          const scoreData = await scoreResponse.json();
          console.log('Credit score data:', scoreData);
          
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

  const saveProfileChanges = async () => {
    if (!profile || !user) return;
    
    try {
      setLoading(true);
      
      // Update the profile with the pending projects
      const updatedProfile = {
        ...profile,
        projects: pendingProjects
      };
      
      const profileDbData = convertProfileToDbData(updatedProfile);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileDbData)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      // Update local state
      setProfile(updatedProfile);
      setHasUnsavedChanges(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setProjectDialogOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    // Add an ID if it doesn't have one (new project)
    if (!project.id) {
      project.id = uuidv4();
    }
    
    // Add the new project to the pending projects array
    const updatedProjects = [...pendingProjects, project];
    
    // Update pending projects, but don't save to database yet
    setPendingProjects(updatedProjects);
    setHasUnsavedChanges(true);
    toast.success('Project added! Click "Save Changes" to update your profile.');
  };

  const handleEditClick = () => {
    navigate('/profile-setup');
  };

  if (loading && !profile) {
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
      <ProfileHeader 
        profile={profile} 
        onEditClick={handleEditClick} 
        onLogout={signOut} 
      />
      
      <div className="mb-4 flex justify-between items-center">
        <Button 
          onClick={handleAddProject}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Project
        </Button>
        
        {hasUnsavedChanges && (
          <Button 
            onClick={saveProfileChanges}
            variant="default"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileContent 
          profile={{
            ...profile,
            projects: pendingProjects // Use pending projects for display
          }} 
        />
        <ProfileSidebar creditScore={creditScore} />
      </div>
      
      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={handleSaveProject}
        project={null}
        isNew={true}
      />
    </ProfileLayout>
  );
};

export default Profile;
