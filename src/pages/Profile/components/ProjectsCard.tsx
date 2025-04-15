
import React from 'react';
import { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Code, ExternalLink, Github, Layers } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface ProjectsCardProps {
  projects: Project[];
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Projects</CardTitle>
        <Layers className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                {project.imageUrl && (
                  <div className="w-full md:w-48 flex-shrink-0">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-32 object-cover rounded-md" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(project.startDate)} 
                    {project.ongoing ? 
                      ' - Present' : 
                      project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-skill-blue hover:underline"
                      >
                        <Github className="h-3 w-3 mr-1" /> GitHub
                      </a>
                    )}
                    {project.projectUrl && (
                      <a 
                        href={project.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-skill-blue hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Code className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No projects added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
