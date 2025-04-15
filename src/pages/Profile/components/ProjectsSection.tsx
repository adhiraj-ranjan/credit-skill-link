
import React, { useState } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Plus, Code } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onChange }) => {
  const addProject = () => {
    onChange([
      ...projects,
      {
        id: uuidv4(),
        title: '',
        description: '',
        technologies: [],
        startDate: new Date().toISOString().split('T')[0],
        ongoing: true,
        imageUrl: '',
        projectUrl: '',
        githubUrl: ''
      }
    ]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(
      projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const updateTechnologies = (id: string, value: string) => {
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    updateProject(id, 'technologies', techArray);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      onChange(projects.filter(project => project.id !== id));
    } else {
      // If it's the last one, just clear the fields
      onChange([{
        id: uuidv4(),
        title: '',
        description: '',
        technologies: [],
        startDate: new Date().toISOString().split('T')[0],
        ongoing: true,
        imageUrl: '',
        projectUrl: '',
        githubUrl: ''
      }]);
    }
  };

  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Projects (Optional)</h3>
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
          <Code className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No projects added yet. Click "Add Project" to showcase your work.</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <div key={project.id} className="grid grid-cols-1 gap-4 mb-6 p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2 mr-2">
                <Label htmlFor={`project-title-${index}`}>Project Title*</Label>
                <Input
                  id={`project-title-${index}`}
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder="E.g., E-commerce Website, Mobile App"
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
              <Label htmlFor={`project-description-${index}`}>Description*</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Brief description of the project and your contribution"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`project-technologies-${index}`}>Technologies (comma-separated)*</Label>
              <Input
                id={`project-technologies-${index}`}
                value={project.technologies.join(', ')}
                onChange={(e) => updateTechnologies(project.id, e.target.value)}
                placeholder="E.g., React, Node.js, MongoDB"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-start-date-${index}`}>Start Date*</Label>
                <Input
                  id={`project-start-date-${index}`}
                  type="date"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`project-end-date-${index}`}>End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`project-ongoing-${index}`}
                      checked={project.ongoing}
                      onCheckedChange={(checked) => {
                        updateProject(project.id, 'ongoing', checked);
                        if (checked) {
                          updateProject(project.id, 'endDate', undefined);
                        }
                      }}
                    />
                    <Label htmlFor={`project-ongoing-${index}`} className="text-sm">Ongoing</Label>
                  </div>
                </div>
                
                <Input
                  id={`project-end-date-${index}`}
                  type="date"
                  value={project.endDate || ''}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  disabled={project.ongoing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                <Input
                  id={`project-url-${index}`}
                  type="url"
                  value={project.projectUrl || ''}
                  onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                  placeholder="https://"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-github-url-${index}`}>GitHub URL</Label>
                <Input
                  id={`project-github-url-${index}`}
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  placeholder="https://github.com/"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-image-url-${index}`}>Image URL</Label>
                <Input
                  id={`project-image-url-${index}`}
                  type="url"
                  value={project.imageUrl || ''}
                  onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectsSection;
