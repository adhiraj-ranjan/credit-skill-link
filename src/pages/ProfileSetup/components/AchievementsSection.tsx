
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Trophy } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementsSectionProps {
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ 
  achievements, 
  setAchievements 
}) => {
  const addAchievement = () => {
    setAchievements([...achievements, { id: crypto.randomUUID(), title: '', description: '' }]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === id ? { ...achievement, [field]: value } : achievement
    ));
  };

  const removeAchievement = (id: string) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter(achievement => achievement.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setAchievements([{ id: crypto.randomUUID(), title: '', description: '' }]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-skill-blue" />
          Achievements (Optional)
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addAchievement}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No achievements added. Click "Add" to add your achievements.
        </div>
      ) : (
        achievements.map((achievement, index) => (
          <div key={achievement.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2 mr-2">
                <Label htmlFor={`achievement-title-${index}`}>Title</Label>
                <Input
                  id={`achievement-title-${index}`}
                  value={achievement.title}
                  onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeAchievement(achievement.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`achievement-description-${index}`}>Description</Label>
              <Textarea
                id={`achievement-description-${index}`}
                value={achievement.description}
                onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AchievementsSection;
