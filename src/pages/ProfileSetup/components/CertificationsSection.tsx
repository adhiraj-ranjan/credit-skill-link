
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Award } from 'lucide-react';
import { Certification } from '@/types';

interface CertificationsSectionProps {
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ 
  certifications, 
  setCertifications 
}) => {
  const addCertification = () => {
    setCertifications([...certifications, { id: crypto.randomUUID(), name: '', issuer: '', date: '' }]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id: string) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter(cert => cert.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setCertifications([{ id: crypto.randomUUID(), name: '', issuer: '', date: '' }]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Award className="h-5 w-5 mr-2 text-skill-blue" />
          Certifications (Optional)
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addCertification}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No certifications added. Click "Add" to add your certifications.
        </div>
      ) : (
        certifications.map((cert, index) => (
          <div key={cert.id} className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4 p-4 border rounded-md">
            <div className="space-y-2">
              <Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
              <Input
                id={`cert-name-${index}`}
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cert-issuer-${index}`}>Issuer</Label>
              <Input
                id={`cert-issuer-${index}`}
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`cert-date-${index}`}>Date</Label>
                <Input
                  id={`cert-date-${index}`}
                  type="date"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => removeCertification(cert.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CertificationsSection;
