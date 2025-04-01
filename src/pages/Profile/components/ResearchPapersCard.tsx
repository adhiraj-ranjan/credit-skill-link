
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ResearchPaper } from '@/types';

interface ResearchPapersCardProps {
  researchPapers: ResearchPaper[];
}

const ResearchPapersCard: React.FC<ResearchPapersCardProps> = ({ researchPapers }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Research Papers</CardTitle>
        <BookOpen className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {researchPapers.map((paper) => (
            <div key={paper.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold">{paper.title}</h4>
              <a 
                href={paper.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-skill-blue hover:underline text-sm mt-2 inline-block"
              >
                View Paper
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchPapersCard;
