
import React, { useState } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectDialog from './ProjectDialog';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectsManagerProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onProjectsChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [isNewProject, setIsNewProject] = useState(true);
  
  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsNewProject(true);
    setDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsNewProject(false);
    setDialogOpen(true);
  };
  
  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedProject) {
      const updatedProjects = projects.filter(p => p.id !== selectedProject.id);
      onProjectsChange(updatedProjects);
    }
    setDeleteDialogOpen(false);
  };
  
  const saveProject = (project: Project) => {
    let updatedProjects: Project[];
    
    if (isNewProject) {
      // Add new project
      updatedProjects = [...projects, project];
    } else {
      // Update existing project
      updatedProjects = projects.map(p => 
        p.id === project.id ? project : p
      );
    }
    
    onProjectsChange(updatedProjects);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Manage Projects</CardTitle>
          <Button 
            onClick={handleAddProject}
            className="flex items-center"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects added yet. Click "Add Project" to create your first project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleDeleteProject(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(project.startDate)}
                    {project.isOngoing ? 
                      " - Present" : 
                      project.endDate ? ` - ${formatDate(project.endDate)}` : ""
                    }
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline">+{project.technologies.length - 3} more</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={saveProject}
        project={selectedProject}
        isNew={isNewProject}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{selectedProject?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsManager;
