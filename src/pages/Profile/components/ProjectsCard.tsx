
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ExternalLink, Folder, Github } from 'lucide-react';
import { Project } from '@/types';

interface ProjectsCardProps {
  projects: Project[];
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  // Display only the first 2 projects on the profile page
  const displayProjects = projects.slice(0, 2);
  
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Projects</CardTitle>
        <Folder className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg">{project.title}</h4>
              <div className="flex items-center text-xs text-muted-foreground mt-1 mb-2">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>
                  {formatDate(project.startDate)}
                  {project.isOngoing 
                    ? ' - Present' 
                    : project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-skill-lightBlue text-skill-blue">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    +{project.technologies.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                {project.githubUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    asChild
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      GitHub
                    </a>
                  </Button>
                )}
                
                {project.liveUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    asChild
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {projects.length > 2 && (
            <div className="text-center">
              <span className="text-sm text-muted-foreground block mb-2">
                Showing 2 of {projects.length} projects
              </span>
            </div>
          )}
          
          <div className="text-center pt-2">
            <Button variant="outline" asChild>
              <Link to="/projects" className="flex items-center justify-center">
                <Folder className="h-4 w-4 mr-2" />
                {projects.length > 0 ? 'View All Projects' : 'Manage Projects'}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
