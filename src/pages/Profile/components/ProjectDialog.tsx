
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';
import { Project } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  project?: Project | null;
  isNew?: boolean;
}

const defaultProject: Project = {
  id: '',
  title: '',
  description: '',
  technologies: [''],
  githubUrl: '',
  liveUrl: '',
  startDate: '',
  endDate: '',
  isOngoing: false
};

const ProjectDialog: React.FC<ProjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  project = null,
  isNew = true
}) => {
  const [formData, setFormData] = useState<Project>({...defaultProject, id: uuidv4()});
  
  useEffect(() => {
    // Initialize with existing project data or default values for new project
    if (open) {
      setFormData(isNew ? {...defaultProject, id: uuidv4()} : {...(project || defaultProject)});
    }
  }, [project, isNew, open]);

  const handleChange = (field: keyof Project, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechChange = (index: number, value: string) => {
    const updatedTech = [...formData.technologies];
    updatedTech[index] = value;
    handleChange('technologies', updatedTech);
  };

  const addTechnology = () => {
    handleChange('technologies', [...formData.technologies, '']);
  };

  const removeTechnology = (index: number) => {
    if (formData.technologies.length > 1) {
      const updatedTech = formData.technologies.filter((_, i) => i !== index);
      handleChange('technologies', updatedTech);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.startDate) {
      // You could add more sophisticated validation and error messages
      alert('Please fill in all required fields');
      return;
    }
    
    // Filter out empty technology entries
    const filteredTech = formData.technologies.filter(tech => tech.trim() !== '');
    if (filteredTech.length === 0) {
      alert('Please add at least one technology');
      return;
    }
    
    // Update form data with filtered technologies
    const finalFormData = {
      ...formData,
      technologies: filteredTech
    };
    
    onSave(finalFormData);
    onOpenChange(false);
  };

  const handleOngoingChange = (checked: boolean) => {
    const updates: Partial<Project> = { isOngoing: checked };
    
    // Clear end date if project is ongoing
    if (checked) {
      updates.endDate = '';
    }
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add New Project' : 'Edit Project'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your project"
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Technologies Used *</Label>
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex gap-2 items-center mt-2">
                  <Input
                    value={tech}
                    onChange={(e) => handleTechChange(index, e.target.value)}
                    placeholder="Technology name"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeTechnology(index)}
                    disabled={formData.technologies.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTechnology}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Technology
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="live">Live Demo URL</Label>
                <Input
                  id="live"
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => handleChange('liveUrl', e.target.value)}
                  placeholder="https://yourproject.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ongoing"
                      checked={formData.isOngoing}
                      onCheckedChange={handleOngoingChange}
                    />
                    <Label htmlFor="ongoing" className="text-sm">Ongoing</Label>
                  </div>
                </div>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={formData.isOngoing}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
