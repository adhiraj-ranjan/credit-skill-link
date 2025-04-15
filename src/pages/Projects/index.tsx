
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { StudentProfile, Project } from '@/types';
import { convertDbDataToProfile } from '@/utils/profileUtils';
import { Button } from '@/components/ui/button';
import { Layers, PlusCircle, ArrowLeft } from 'lucide-react';
import ProjectsList from './components/ProjectsList';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
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
          // Transform DB data to StudentProfile type
          const profileData = convertDbDataToProfile(data);
          setProjects(profileData.projects || []);
        } else {
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Error in projects fetching:', error);
        toast.error('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [user, navigate]);

  const handleAddProject = () => {
    navigate('/profile-setup');
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
          <p className="mt-4 text-skill-darkGray">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skill-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Actions */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-skill-blue" />
            <h1 className="text-3xl font-bold text-skill-darkGray">My Projects</h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToProfile}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Button>
            <Button 
              onClick={handleAddProject}
              className="flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
        </div>

        {/* Projects List */}
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
};

export default ProjectsPage;
