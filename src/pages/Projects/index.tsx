import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, ArrowLeft, Folder } from 'lucide-react';
import { Project } from '@/types';
import { convertDbDataToProfile, convertProfileToDbData } from '@/utils/profileUtils';
import ProjectCard from './components/ProjectCard';
import ProjectForm from './components/ProjectForm';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load projects. Please try again.');
        return;
      }
      
      const profileData = convertDbDataToProfile(data);
      setProjects(profileData.projects || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      const updatedProjects = projects.filter(p => p.id !== projectToDelete);
      
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          projects: updatedProjects as any
        })
        .eq('id', user?.id);
      
      if (error) {
        console.error('Error updating projects:', error);
        toast.error('Failed to delete project. Please try again.');
        return;
      }
      
      setProjects(updatedProjects);
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleFormSubmit = async (projectData: Project) => {
    try {
      const isEditing = !!selectedProject;
      let imageUrl = projectData.imageUrl;
      let imageFile = null;
      
      // Get the image file from the form submission event
      if ((event as any)?.imageFile) {
        imageFile = (event as any).imageFile;
      }
      
      // Handle image upload if there's a new image
      if (imageFile) {
        const file = imageFile;
        const fileName = `${user?.id}/${uuidv4()}-${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file, {
            upsert: true
          });
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Image upload failed. Project will be saved without the image.');
        } else {
          const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(fileName);
            
          imageUrl = urlData.publicUrl;
        }
      }
      
      // Update project data with new image URL
      const projectToSave: Project = {
        ...projectData,
        imageUrl
      };
      
      let updatedProjects: Project[];
      
      if (isEditing) {
        // Update existing project
        updatedProjects = projects.map(p => 
          p.id === projectToSave.id ? projectToSave : p
        );
      } else {
        // Add new project
        updatedProjects = [...projects, projectToSave];
      }
      
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          projects: updatedProjects as any
        })
        .eq('id', user?.id);
      
      if (error) {
        console.error('Error updating projects:', error);
        toast.error('Failed to save project. Please try again.');
        return;
      }
      
      setProjects(updatedProjects);
      setShowForm(false);
      setSelectedProject(null);
      
      toast.success(isEditing ? 'Project updated successfully' : 'Project added successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-skill-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold flex items-center text-skill-darkGray">
              <Folder className="h-8 w-8 mr-2 text-skill-blue" />
              My Projects
            </h1>
          </div>
          <Button 
            onClick={handleAddProject}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
        
        {/* Project Form */}
        {showForm && (
          <div className="mb-8">
            <ProjectForm 
              project={selectedProject || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
        
        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
              <p className="mt-4 text-skill-darkGray">Loading your projects...</p>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-xl text-center">No Projects Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-muted-foreground mb-6">
                Showcase your skills by adding projects you've worked on.
              </p>
              <Button onClick={handleAddProject} className="flex items-center mx-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
