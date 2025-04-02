
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Edit, LogOut, Briefcase } from 'lucide-react';
import { StudentProfile } from '@/types';

interface ProfileHeaderProps {
  profile: StudentProfile;
  onEditClick: () => void;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onEditClick, onLogout }) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center space-x-2">
        <GraduationCap className="h-8 w-8 text-skill-blue" />
        <h1 className="text-3xl font-bold text-skill-darkGray">Student Profile</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          asChild
          className="flex items-center"
        >
          <Link to="/job-postings">
            <Briefcase className="mr-2 h-4 w-4" /> Job Postings
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={onEditClick}
          className="flex items-center"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
        <Button
          variant="destructive"
          onClick={onLogout}
          className="flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
