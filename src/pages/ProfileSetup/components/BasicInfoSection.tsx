
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoSectionProps {
  fullName: string;
  setFullName: (value: string) => void;
  collegeName: string;
  setCollegeName: (value: string) => void;
  course: string;
  setCourse: (value: string) => void;
  degree: string;
  setDegree: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  fullName, setFullName,
  collegeName, setCollegeName,
  course, setCourse,
  degree, setDegree,
  address, setAddress
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name*</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="collegeName">College Name*</Label>
        <Input
          id="collegeName"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course">Course*</Label>
        <Input
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="degree">Degree*</Label>
        <Select onValueChange={setDegree} value={degree}>
          <SelectTrigger id="degree">
            <SelectValue placeholder="Select degree" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bachelor">Bachelor's</SelectItem>
            <SelectItem value="master">Master's</SelectItem>
            <SelectItem value="phd">Ph.D.</SelectItem>
            <SelectItem value="diploma">Diploma</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address*</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
