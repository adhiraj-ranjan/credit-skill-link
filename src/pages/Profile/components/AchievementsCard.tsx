
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementsCardProps {
  achievements: Achievement[];
}

const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Achievements</CardTitle>
        <Trophy className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;
