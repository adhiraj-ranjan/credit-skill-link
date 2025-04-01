
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, CalendarIcon } from 'lucide-react';
import { HackathonDetail } from '@/types';

interface HackathonDetailsCardProps {
  hackathonDetails: HackathonDetail[];
}

const HackathonDetailsCard: React.FC<HackathonDetailsCardProps> = ({ hackathonDetails }) => {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Hackathon Details</CardTitle>
        <Trophy className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathonDetails.map((hackathon) => (
            <div key={hackathon.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${hackathon.won ? 'border-green-300 bg-green-50' : ''}`}>
              <h4 className="font-semibold">{hackathon.name}</h4>
              {hackathon.position && (
                <div className="text-sm text-gray-700 font-medium mt-1">{hackathon.position}</div>
              )}
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDate(hackathon.date)}
              </div>
              {hackathon.won && (
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Trophy className="h-3 w-3 mr-1" /> Winner
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HackathonDetailsCard;
