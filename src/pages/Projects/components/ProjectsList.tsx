
import React from 'react';
import { Project } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Code, ExternalLink, Github, Layers } from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Code className="h-16 w-16 mx-auto mb-3 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No projects yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't added any projects to your profile. Add your first project to showcase your skills and experience.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            {project.imageUrl ? (
              <div className="w-full h-48">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                <Layers className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(project.startDate)} 
              {project.ongoing ? 
                ' - Present' : 
                project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-skill-blue hover:underline"
                >
                  <Github className="h-4 w-4 mr-1" /> GitHub
                </a>
              )}
              {project.projectUrl && (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-skill-blue hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
