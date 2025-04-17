
import React from 'react';
import { Link } from 'react-router-dom';
import { StudentProfile } from '@/types';
import PersonalInfoCard from './PersonalInfoCard';
import HackathonDetailsCard from './HackathonDetailsCard';
import CertificationsCard from './CertificationsCard';
import AchievementsCard from './AchievementsCard';
import ResearchPapersCard from './ResearchPapersCard';
import ProjectsCard from './ProjectsCard';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ProfileContentProps {
  profile: StudentProfile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  // Show at most 2 projects on the profile page
  const limitedProjects = profile.projects && profile.projects.length > 0 
    ? profile.projects.slice(0, 2) 
    : [];
  
  const hasMoreProjects = profile.projects && profile.projects.length > 2;

  return (
    <div className="lg:col-span-2 space-y-6">
      <PersonalInfoCard profile={profile} />
      
      {profile.hackathonDetails && profile.hackathonDetails.length > 0 && (
        <HackathonDetailsCard hackathonDetails={profile.hackathonDetails} />
      )}
      
      {limitedProjects.length > 0 && (
        <div>
          <ProjectsCard projects={limitedProjects} />
          {hasMoreProjects && (
            <div className="flex justify-center mt-3">
              <Button asChild variant="ghost" size="sm" className="text-skill-blue">
                <Link to="/projects" className="flex items-center gap-1">
                  View All Projects <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
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
