
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Trophy, Award } from 'lucide-react';
import { StudentProfile } from '@/types';
import { GraduationCap } from 'lucide-react';

interface PersonalInfoCardProps {
  profile: StudentProfile;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
        <User className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-skill-blue flex-shrink-0">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <GraduationCap className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-skill-darkGray">{profile.fullName}</h2>
            <p className="text-gray-600">{profile.course} | {profile.collegeName}</p>
            <p className="text-gray-600">{profile.address}</p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-skill-lightBlue text-skill-blue rounded-full text-sm">
                {profile.degree}
              </span>
              {profile.degreeCompleted && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Completed
                </span>
              )}
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                CGPA: {profile.cgpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <Trophy className="h-5 w-5 mr-2 text-skill-blue" />
              Hackathon Experience
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Participations</span>
                <span className="font-medium">{profile.hackathonParticipation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wins</span>
                <span className="font-medium">{profile.hackathonWins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium">
                  {profile.hackathonParticipation > 0 
                    ? `${((profile.hackathonWins / profile.hackathonParticipation) * 100).toFixed(1)}%` 
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <Award className="h-5 w-5 mr-2 text-skill-blue" />
              Achievements
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Certifications</span>
                <span className="font-medium">{profile.certifications?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Achievements</span>
                <span className="font-medium">{profile.achievements?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Research Papers</span>
                <span className="font-medium">{profile.researchPapers?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
