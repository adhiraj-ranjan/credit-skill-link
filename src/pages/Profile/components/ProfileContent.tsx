
import React from 'react';
import { StudentProfile } from '@/types';
import PersonalInfoCard from './PersonalInfoCard';
import HackathonDetailsCard from './HackathonDetailsCard';
import CertificationsCard from './CertificationsCard';
import AchievementsCard from './AchievementsCard';
import ResearchPapersCard from './ResearchPapersCard';
import ProjectsCard from './ProjectsCard';

interface ProfileContentProps {
  profile: StudentProfile;
  onEditProjects?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <PersonalInfoCard profile={profile} />
      
      {profile.projects && profile.projects.length > 0 && (
        <ProjectsCard 
          projects={profile.projects}
        />
      )}
      
      {profile.hackathonDetails && profile.hackathonDetails.length > 0 && (
        <HackathonDetailsCard hackathonDetails={profile.hackathonDetails} />
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
