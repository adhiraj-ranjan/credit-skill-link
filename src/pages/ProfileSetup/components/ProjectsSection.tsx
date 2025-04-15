
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Code } from 'lucide-react';
import { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, setProjects }) => {
  const addProject = () => {
    setProjects([...projects, { 
      id: crypto.randomUUID(), 
      title: '', 
      description: '', 
      technologies: [], 
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const updateTechnologies = (id: string, value: string) => {
    // Split by commas and trim whitespace
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    updateProject(id, 'technologies', techArray);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(project => project.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setProjects([{ 
        id: crypto.randomUUID(), 
        title: '', 
        description: '', 
        technologies: [], 
        date: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Code className="h-5 w-5 mr-2 text-skill-blue" />
          Projects (Optional)
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addProject}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No projects added. Click "Add Project" to showcase your work.
        </div>
      ) : (
        projects.map((project, index) => (
          <div key={project.id} className="grid grid-cols-1 gap-4 mb-6 p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2 mr-2">
                <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                <Input
                  id={`project-title-${index}`}
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeProject(project.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="A brief description of your project..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-technologies-${index}`}>Technologies (comma-separated)</Label>
              <Input
                id={`project-technologies-${index}`}
                value={project.technologies.join(', ')}
                onChange={(e) => updateTechnologies(project.id, e.target.value)}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-date-${index}`}>Date</Label>
                <Input
                  id={`project-date-${index}`}
                  type="date"
                  value={project.date}
                  onChange={(e) => updateProject(project.id, 'date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-url-${index}`}>Project URL (Optional)</Label>
                <Input
                  id={`project-url-${index}`}
                  type="url"
                  value={project.projectUrl || ''}
                  onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                  placeholder="https://myproject.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`github-url-${index}`}>GitHub URL (Optional)</Label>
                <Input
                  id={`github-url-${index}`}
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  placeholder="https://github.com/yourusername/repo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-image-${index}`}>Project Image URL (Optional)</Label>
              <Input
                id={`project-image-${index}`}
                type="url"
                value={project.imageUrl || ''}
                onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectsSection;
