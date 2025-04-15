
import React from 'react';
import { Link } from 'react-router-dom';
import { StudentProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import PersonalInfoCard from './PersonalInfoCard';
import HackathonDetailsCard from './HackathonDetailsCard';
import CertificationsCard from './CertificationsCard';
import AchievementsCard from './AchievementsCard';
import ResearchPapersCard from './ResearchPapersCard';
import ProjectsCard from './ProjectsCard';

interface ProfileContentProps {
  profile: StudentProfile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <PersonalInfoCard profile={profile} />
      
      {profile.hackathonDetails && profile.hackathonDetails.length > 0 && (
        <HackathonDetailsCard hackathonDetails={profile.hackathonDetails} />
      )}
      
      {profile.projects && profile.projects.length > 0 && (
        <div className="relative">
          <ProjectsCard projects={profile.projects.slice(0, 2)} />
          {profile.projects.length > 2 && (
            <div className="flex justify-center mt-4">
              <Link to="/projects">
                <Button variant="outline" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  View All Projects ({profile.projects.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {profile.certifications && profile.certifications.length > 0 && (
        <CertificationsCard certifications={profile.certifications} />
      )}
      
      {profile.achievements && profile.achievements.length > 0 && (
        <AchievementsCard achievements={profile.achievements} />
      )}
      
      {profile.researchPapers && profile.researchPapers.length > 0 && (
        <ResearchPapersCard researchPapers={profile.researchPapers} />
      )}
    </div>
  );
};

export default ProfileContent;
