
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, BookOpen } from 'lucide-react';
import { ResearchPaper } from '@/types';

interface ResearchPapersSectionProps {
  researchPapers: ResearchPaper[];
  setResearchPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>>;
}

const ResearchPapersSection: React.FC<ResearchPapersSectionProps> = ({ 
  researchPapers, 
  setResearchPapers 
}) => {
  const addResearchPaper = () => {
    setResearchPapers([...researchPapers, { id: crypto.randomUUID(), title: '', url: '' }]);
  };

  const updateResearchPaper = (id: string, field: keyof ResearchPaper, value: string) => {
    setResearchPapers(researchPapers.map(paper => 
      paper.id === id ? { ...paper, [field]: value } : paper
    ));
  };

  const removeResearchPaper = (id: string) => {
    if (researchPapers.length > 1) {
      setResearchPapers(researchPapers.filter(paper => paper.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setResearchPapers([{ id: crypto.randomUUID(), title: '', url: '' }]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-skill-blue" />
          Research Papers (Optional)
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addResearchPaper}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {researchPapers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No research papers added. Click "Add" to add your research papers.
        </div>
      ) : (
        researchPapers.map((paper, index) => (
          <div key={paper.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2 mr-2">
                <Label htmlFor={`paper-title-${index}`}>Paper Title</Label>
                <Input
                  id={`paper-title-${index}`}
                  value={paper.title}
                  onChange={(e) => updateResearchPaper(paper.id, 'title', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeResearchPaper(paper.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`paper-url-${index}`}>URL</Label>
              <Input
                id={`paper-url-${index}`}
                type="url"
                value={paper.url}
                onChange={(e) => updateResearchPaper(paper.id, 'url', e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResearchPapersSection;
