
import React from 'react';
import { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Code, ExternalLink, Github } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(project.startDate)} 
          {project.ongoing ? 
            ' - Present' : 
            project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.imageUrl && (
            <div className="md:col-span-1">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-48 object-cover rounded-md" 
              />
            </div>
          )}
          
          <div className={`${project.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <p className="text-gray-700 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex flex-wrap gap-3">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-skill-blue hover:underline"
            >
              <Github className="h-4 w-4 mr-1" /> Source Code
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
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/profile-setup')}
        >
          Edit Project
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
