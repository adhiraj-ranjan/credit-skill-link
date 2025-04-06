
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { Code, ExternalLink, GitHub, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectsCardProps {
  projects: Project[];
  isEditing?: boolean;
  onEdit?: () => void;
}

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

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects, isEditing = false, onEdit }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Projects</CardTitle>
        <div className="flex items-center">
          <Code className="h-5 w-5 text-skill-blue mr-2" />
          {onEdit && (
            <Button 
              variant="ghost" 
              className="h-8 px-2 text-sm" 
              onClick={onEdit}
            >
              Edit Projects
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No projects added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(project.startDate)}
                      {project.isOngoing ? 
                        " - Present" : 
                        project.endDate ? ` - ${formatDate(project.endDate)}` : ""
                      }
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-2 mb-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-3">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-skill-blue hover:underline"
                    >
                      <GitHub className="h-4 w-4 mr-1" /> GitHub Repo
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-skill-blue hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
