
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { Certification } from '@/types';

interface CertificationsCardProps {
  certifications: Certification[];
}

const CertificationsCard: React.FC<CertificationsCardProps> = ({ certifications }) => {
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
        <CardTitle className="text-xl font-bold">Certifications</CardTitle>
        <Award className="h-5 w-5 text-skill-blue" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold">{cert.name}</h4>
              <div className="text-sm text-gray-600 mt-1">{cert.issuer}</div>
              <div className="text-xs text-gray-500 mt-2">
                {formatDate(cert.date)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationsCard;
