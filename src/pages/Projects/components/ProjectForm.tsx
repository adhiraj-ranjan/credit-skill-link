
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Image, Link, Github } from 'lucide-react';
import { Project } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

const defaultProject: Project = {
  id: '',
  title: '',
  description: '',
  technologies: [],
  startDate: new Date().toISOString().split('T')[0],
  isOngoing: true,
  githubUrl: '',
  liveUrl: '',
  imageUrl: ''
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Project>(project || {...defaultProject, id: uuidv4()});
  const [newTech, setNewTech] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (project) {
      setFormData(project);
      if (project.imageUrl) {
        setImagePreview(project.imageUrl);
      }
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      isOngoing: checked,
      endDate: checked ? undefined : prev.endDate
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      imageFile: imageFile as any // Pass the file separately for upload
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title*</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          {/* Technologies */}
          <div className="space-y-2">
            <Label>Technologies*</Label>
            <div className="flex space-x-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a technology and press Enter"
              />
              <Button 
                type="button" 
                onClick={addTechnology}
                size="icon"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-skill-lightBlue text-skill-blue px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => removeTechnology(tech)}
                      className="ml-1.5 text-skill-blue focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className={formData.isOngoing ? 'text-gray-400' : ''}>End Date</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isOngoing"
                    checked={formData.isOngoing}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isOngoing" className="text-sm">Ongoing</Label>
                </div>
              </div>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={handleChange}
                disabled={formData.isOngoing}
              />
            </div>
          </div>
          
          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="flex items-center">
                <Github className="h-4 w-4 mr-1" /> GitHub URL
              </Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl || ''}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="flex items-center">
                <Link className="h-4 w-4 mr-1" /> Live Demo URL
              </Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          {/* Project Image */}
          <div className="space-y-2">
            <Label htmlFor="projectImage" className="flex items-center">
              <Image className="h-4 w-4 mr-1" /> Project Image
            </Label>
            
            {imagePreview && (
              <div className="relative w-full h-40 mb-2 border rounded-md overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Project Preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Input
              id="projectImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={imagePreview ? 'hidden' : ''}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {project ? 'Update Project' : 'Add Project'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectForm;
