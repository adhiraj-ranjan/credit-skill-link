import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { Certification, Achievement, ResearchPaper, HackathonDetail, Project } from '@/types';
import { convertDbDataToProfile, convertProfileToDbData } from '@/utils/profileUtils';
import ProjectsSection from './components/ProjectsSection';
import HackathonSection from './components/HackathonSection';
import CertificationsSection from './components/CertificationsSection';
import AchievementsSection from './components/AchievementsSection';
import ResearchPapersSection from './components/ResearchPapersSection';
import BasicInfoSection from './components/BasicInfoSection';
import { v4 as uuidv4 } from 'uuid';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, hasProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Profile state
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [degree, setDegree] = useState('');
  const [address, setAddress] = useState('');
  const [hackathonParticipation, setHackathonParticipation] = useState(0);
  const [hackathonWins, setHackathonWins] = useState(0);
  const [hackathonDetails, setHackathonDetails] = useState<HackathonDetail[]>([]);
  const [cgpa, setCgpa] = useState(0);
  const [degreeCompleted, setDegreeCompleted] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingProfileImage, setExistingProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if we're in edit mode by fetching existing profile
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          console.log('Fetched profile data:', data);
          setIsEditMode(true);
          
          // Use our utility function to convert DB data to profile format
          const profileData = convertDbDataToProfile(data);
          
          // Populate form with existing data
          setFullName(profileData.fullName);
          setCollegeName(profileData.collegeName);
          setCourse(profileData.course);
          setDegree(profileData.degree);
          setAddress(profileData.address);
          setHackathonParticipation(profileData.hackathonParticipation);
          setHackathonWins(profileData.hackathonWins);
          setHackathonDetails(profileData.hackathonDetails || []);
          setCgpa(profileData.cgpa);
          setDegreeCompleted(profileData.degreeCompleted);
          setCertifications(profileData.certifications || []);
          setAchievements(profileData.achievements || []);
          setResearchPapers(profileData.researchPapers || []);
          setProjects(profileData.projects || []);
          setExistingProfileImage(profileData.profileImage || null);
        } else {
          // Initialize with empty values for new profile
          setHackathonDetails([{ id: uuidv4(), name: '', date: '', won: false }]);
          setCertifications([{ id: uuidv4(), name: '', issuer: '', date: '' }]);
          setAchievements([{ id: uuidv4(), title: '', description: '' }]);
          setResearchPapers([{ id: uuidv4(), title: '', url: '' }]);
          setProjects([{ 
            id: uuidv4(), 
            title: '', 
            description: '', 
            technologies: [], 
            date: new Date().toISOString().split('T')[0]
          }]);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filterEmptyItems = <T extends { id: string }>(items: T[]): T[] => {
    // Filter out items with no data
    return items.filter(item => {
      // Check if all string properties have values
      return Object.entries(item).some(([key, value]) => {
        return typeof value === 'string' && key !== 'id' && value.trim() !== '';
      });
    });
  };

  const validateForm = () => {
    // Required fields validation
    if (!fullName || !collegeName || !course || !degree || !address) {
      toast.error('Please fill in all required basic information fields.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    console.log('Starting profile submission...');

    try {
      // Upload profile image if exists
      let profileImageUrl = existingProfileImage || '';
      
      if (profileImage && user) {
        console.log('Uploading profile image...');
        const fileName = `${user.id}/${Date.now()}-${profileImage.name}`;
        
        const { data, error } = await supabase.storage
          .from('profile-images')
          .upload(fileName, profileImage, {
            upsert: true
          });

        if (error) {
          console.error('Error uploading profile image:', error);
          throw new Error('Error uploading profile image: ' + error.message);
        }
        
        console.log('Image upload successful:', data);
        
        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);
          
        profileImageUrl = urlData.publicUrl;
        console.log('Profile image URL:', profileImageUrl);
      }
      
      // Filter out empty/incomplete entries
      const validCertifications = filterEmptyItems(certifications);
      const validAchievements = filterEmptyItems(achievements);
      const validResearchPapers = filterEmptyItems(researchPapers);
      const validHackathonDetails = filterEmptyItems(hackathonDetails) as HackathonDetail[];
      const validProjects = filterEmptyItems(projects) as Project[];
      
      // Save profile details to Supabase
      if (user) {
        console.log('Saving profile data...');
        
        // Create profile object
        const profile = {
          id: user.id,
          fullName,
          collegeName,
          course,
          degree,
          address,
          hackathonParticipation: validHackathonDetails.length,
          hackathonWins: validHackathonDetails.filter(h => h.won).length,
          hackathonDetails: validHackathonDetails,
          cgpa,
          degreeCompleted,
          certifications: validCertifications,
          achievements: validAchievements,
          researchPapers: validResearchPapers,
          projects: validProjects,
          profileImage: profileImageUrl
        };
        
        // Convert profile to DB format
        const profileDbData = convertProfileToDbData(profile);
        console.log('Profile data to save:', profileDbData);
        
        const { error } = await supabase
          .from('profiles')
          .upsert(profileDbData, { onConflict: 'id' });

        if (error) {
          console.error('Error saving profile:', error);
          throw new Error('Error saving profile: ' + error.message);
        }
        
        console.log('Profile saved successfully!');
      }

      // Call the update score API
      try {
        const scoreResponse = await fetch('https://skillcredit.pythonanywhere.com/update-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: parseInt(user.id, 36) % 10000, // Convert UUID to a numeric ID
            hackathon_participation: hackathonParticipation,
            hackathon_wins: hackathonWins,
            cgpa: cgpa,
            degree_completed: degreeCompleted,
            certifications: certifications.length,
            extras: achievements.length + researchPapers.length + projects.length
          }),
        });

        if (!scoreResponse.ok) {
          console.error('Failed to update credit score:', await scoreResponse.text());
        } else {
          console.log('Credit score updated successfully');
        }
      } catch (scoreError) {
        console.error('Error updating credit score:', scoreError);
        // Don't throw here, as we still want to navigate to profile
      }

      toast.success('Profile saved successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-skill-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <GraduationCap className="h-8 w-8 text-skill-blue" />
          <h1 className="text-3xl font-bold text-skill-darkGray">
            {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Fill out your academic and professional details to set up your SkillCredit profile.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-skill-blue flex items-center justify-center bg-gray-100">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : existingProfileImage ? (
                      <img 
                        src={existingProfileImage} 
                        alt="Current Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile-image" className="cursor-pointer bg-skill-blue hover:bg-skill-darkBlue text-white py-2 px-4 rounded-md inline-block">
                    Choose Profile Photo
                  </Label>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageChange} 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Basic Information */}
              <BasicInfoSection
                fullName={fullName}
                setFullName={setFullName}
                collegeName={collegeName}
                setCollegeName={setCollegeName}
                course={course}
                setCourse={setCourse}
                degree={degree}
                setDegree={setDegree}
                address={address}
                setAddress={setAddress}
              />

              {/* Academic Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Academic Details</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA (0-10)</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="degreeCompleted">Degree Completed</Label>
                    <Switch
                      id="degreeCompleted"
                      checked={degreeCompleted}
                      onCheckedChange={setDegreeCompleted}
                    />
                  </div>
                </div>
              </div>

              {/* Projects */}
              <ProjectsSection projects={projects} setProjects={setProjects} />

              {/* Hackathon Details */}
              <HackathonSection
                hackathonDetails={hackathonDetails}
                setHackathonDetails={setHackathonDetails}
              />

              {/* Certifications */}
              <CertificationsSection
                certifications={certifications}
                setCertifications={setCertifications}
              />

              {/* Achievements */}
              <AchievementsSection
                achievements={achievements}
                setAchievements={setAchievements}
              />

              {/* Research Papers */}
              <ResearchPapersSection
                researchPapers={researchPapers}
                setResearchPapers={setResearchPapers}
              />
            </CardContent>
            <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Profile' : 'Save Profile'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
