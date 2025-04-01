
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { CreditScoreResponse } from '@/types';
import CreditScoreChart from './CreditScoreChart';

interface ProfileSidebarProps {
  creditScore: CreditScoreResponse | null;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ creditScore }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Credit Score</CardTitle>
          <FileText className="h-5 w-5 text-skill-blue" />
        </CardHeader>
        <CardContent>
          {creditScore ? (
            <CreditScoreChart creditScore={creditScore} />
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Credit score data is not available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
