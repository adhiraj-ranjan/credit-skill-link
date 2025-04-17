
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Project, StudentProfile } from '@/types';
import { convertDbDataToProfile } from '@/utils/profileUtils';
import { ChevronLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCard from './components/ProjectCard';

const Projects = () => {
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
          
          // Transform DB data to our StudentProfile type
          const profileData = convertDbDataToProfile(data);
          
          // Set projects if they exist
          if (profileData.projects && profileData.projects.length > 0) {
            setProjects(profileData.projects);
          }
        } else {
          // No profile found, redirect to setup
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Error in profile fetching:', error);
        toast.error('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>
        <Button
          onClick={() => navigate('/profile-setup')}
          variant="outline"
        >
          Add New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
            <p className="mt-4 text-skill-darkGray">Loading your projects...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Layers className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  You haven't added any projects yet. Add projects to showcase your work and skills.
                </p>
                <Button 
                  onClick={() => navigate('/profile-setup')}
                  variant="default"
                >
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
