
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Link, Github, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectsCardProps {
  projects: Project[];
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Projects</CardTitle>
        <Code className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.imageUrl && (
                  <div className="col-span-1">
                    <div className="w-full h-48 rounded-md overflow-hidden border">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                )}
                
                <div className={`${project.imageUrl ? 'md:col-span-2' : 'md:col-span-3'} space-y-3`}>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  
                  <p className="text-gray-600 text-sm">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-100">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 pt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {formatDate(project.date)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.projectUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Link className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
