
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Code, ExternalLink, GitHub, Pencil, Trash2 } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {project.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(project)} 
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(project.id)} 
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          <span>
            {formatDate(project.startDate)}
            {project.isOngoing 
              ? ' - Present' 
              : project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          {project.githubUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              asChild
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GitHub className="h-3.5 w-3.5 mr-1.5" />
                GitHub
              </a>
            </Button>
          )}
          
          {project.liveUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              asChild
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
