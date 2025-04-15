
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Trophy } from 'lucide-react';
import { HackathonDetail } from '@/types';

interface HackathonSectionProps {
  hackathonDetails: HackathonDetail[];
  setHackathonDetails: React.Dispatch<React.SetStateAction<HackathonDetail[]>>;
}

const HackathonSection: React.FC<HackathonSectionProps> = ({ 
  hackathonDetails, 
  setHackathonDetails 
}) => {
  const addHackathonDetail = () => {
    setHackathonDetails([...hackathonDetails, { id: crypto.randomUUID(), name: '', date: '', won: false }]);
  };

  const updateHackathonDetail = (id: string, field: keyof HackathonDetail, value: string | boolean) => {
    setHackathonDetails(hackathonDetails.map(detail => 
      detail.id === id ? { ...detail, [field]: value } : detail
    ));
  };

  const removeHackathonDetail = (id: string) => {
    if (hackathonDetails.length > 1) {
      setHackathonDetails(hackathonDetails.filter(detail => detail.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setHackathonDetails([{ id: crypto.randomUUID(), name: '', date: '', won: false }]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-skill-blue" />
          Hackathon Experience
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addHackathonDetail}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Hackathon
        </Button>
      </div>

      {hackathonDetails.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hackathons added. Click "Add Hackathon" to add your hackathon experiences.
        </div>
      ) : (
        hackathonDetails.map((hackathon, index) => (
          <div key={hackathon.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2 mr-2">
                <Label htmlFor={`hackathon-name-${index}`}>Hackathon Name</Label>
                <Input
                  id={`hackathon-name-${index}`}
                  value={hackathon.name}
                  onChange={(e) => updateHackathonDetail(hackathon.id, 'name', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeHackathonDetail(hackathon.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`hackathon-date-${index}`}>Date</Label>
                <Input
                  id={`hackathon-date-${index}`}
                  type="date"
                  value={hackathon.date}
                  onChange={(e) => updateHackathonDetail(hackathon.id, 'date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`hackathon-position-${index}`}>Position/Rank (optional)</Label>
                <Input
                  id={`hackathon-position-${index}`}
                  value={hackathon.position || ''}
                  onChange={(e) => updateHackathonDetail(hackathon.id, 'position', e.target.value)}
                  placeholder="e.g., 1st Place, Runner-up"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id={`hackathon-won-${index}`}
                checked={hackathon.won}
                onCheckedChange={(checked) => updateHackathonDetail(hackathon.id, 'won', checked)}
              />
              <Label htmlFor={`hackathon-won-${index}`}>Won this hackathon</Label>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HackathonSection;
