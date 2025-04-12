
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
import ProjectsManager from './components/ProjectsManager';
import ProjectDialog from './components/ProjectDialog';
import { convertDbDataToProfile, convertProfileToDbData } from '@/utils/profileUtils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResponse | null>(null);
  const [editingProjects, setEditingProjects] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
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

    fetchUserProfile();
  }, [user, navigate]);

  const handleProjectsChange = async (updatedProjects: Project[]) => {
    if (!profile || !user) return;
    
    try {
      setLoading(true);
      
      const updatedProfile = {
        ...profile,
        projects: updatedProjects
      };
      setProfile(updatedProfile);

      const profileDbData = convertProfileToDbData({
        ...profile,
        projects: updatedProjects
      });
      
      const { error } = await supabase
        .from('profiles')
        .update(profileDbData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Projects updated successfully!');
    } catch (error) {
      console.error('Error updating projects:', error);
      toast.error('Failed to update projects. Please try again.');
      
      fetchUserProfile();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const profileData = convertDbDataToProfile(data);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditClick = () => {
    navigate('/profile-setup');
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setProjectDialogOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (!profile) return;
    
    let updatedProjects: Project[];
    
    if (selectedProject) {
      // Update existing project
      updatedProjects = profile.projects.map(p => 
        p.id === project.id ? project : p
      );
    } else {
      // Add new project
      updatedProjects = [...profile.projects, project];
    }
    
    handleProjectsChange(updatedProjects);
    setProjectDialogOpen(false);
  };

  const handleEditProjects = () => {
    setEditingProjects(true);
  };

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
      <ProfileHeader 
        profile={profile} 
        onEditClick={handleEditClick} 
        onLogout={signOut} 
      />
      
      {editingProjects ? (
        <div className="mb-8">
          <ProjectsManager 
            projects={profile.projects || []} 
            onProjectsChange={(projects) => {
              handleProjectsChange(projects);
              setEditingProjects(false);
            }} 
          />
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setEditingProjects(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setEditingProjects(false)}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button 
              onClick={handleAddProject}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ProfileContent 
              profile={profile} 
              onEditProjects={handleEditProjects}
            />
            <ProfileSidebar creditScore={creditScore} />
          </div>
        </>
      )}
      
      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={handleSaveProject}
        project={selectedProject}
        isNew={!selectedProject}
      />
    </ProfileLayout>
  );
};

export default Profile;
