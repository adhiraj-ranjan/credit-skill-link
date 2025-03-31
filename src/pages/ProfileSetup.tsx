import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Award, GraduationCap, X, Plus } from 'lucide-react';
import { Certification, Achievement, ResearchPaper, HackathonDetail } from '@/types';
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
          // Populate form with existing data
          setFullName(data.full_name || '');
          setCollegeName(data.college_name || '');
          setCourse(data.course || '');
          setDegree(data.degree || '');
          setAddress(data.address || '');
          setHackathonParticipation(data.hackathon_participation || 0);
          setHackathonWins(data.hackathon_wins || 0);
          setHackathonDetails(data.hackathon_details || []);
          setCgpa(data.cgpa || 0);
          setDegreeCompleted(data.degree_completed || false);
          setCertifications(data.certifications || []);
          setAchievements(data.achievements || []);
          setResearchPapers(data.research_papers || []);
          setExistingProfileImage(data.profile_image || null);
        } else {
          // Initialize with empty values for new profile
          setCertifications([{ id: uuidv4(), name: '', issuer: '', date: '' }]);
          setAchievements([{ id: uuidv4(), title: '', description: '' }]);
          setResearchPapers([{ id: uuidv4(), title: '', url: '' }]);
          setHackathonDetails([{ id: uuidv4(), name: '', date: '', won: false }]);
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

  // Hackathon details management
  const addHackathonDetail = () => {
    setHackathonDetails([...hackathonDetails, { id: uuidv4(), name: '', date: '', won: false }]);
  };

  const updateHackathonDetail = (id: string, field: keyof HackathonDetail, value: string | boolean) => {
    setHackathonDetails(hackathonDetails.map(detail => 
      detail.id === id ? { ...detail, [field]: value } : detail
    ));

    // Update hackathon participation and wins count based on details
    if (field === 'won') {
      const winCount = hackathonDetails.filter(detail => 
        detail.id === id ? value : detail.won
      ).length;
      setHackathonWins(winCount);
      setHackathonParticipation(hackathonDetails.length);
    }
  };

  const removeHackathonDetail = (id: string) => {
    if (hackathonDetails.length > 1) {
      const updatedDetails = hackathonDetails.filter(detail => detail.id !== id);
      setHackathonDetails(updatedDetails);
      
      // Update counts
      setHackathonParticipation(updatedDetails.length);
      setHackathonWins(updatedDetails.filter(detail => detail.won).length);
    }
  };

  // Certification management
  const addCertification = () => {
    setCertifications([...certifications, { id: uuidv4(), name: '', issuer: '', date: '' }]);
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
      setCertifications([{ id: uuidv4(), name: '', issuer: '', date: '' }]);
    }
  };

  // Achievement management
  const addAchievement = () => {
    setAchievements([...achievements, { id: uuidv4(), title: '', description: '' }]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === id ? { ...achievement, [field]: value } : achievement
    ));
  };

  const removeAchievement = (id: string) => {
    if (achievements.length > 1) {
      setAchievements(achievements.filter(achievement => achievement.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setAchievements([{ id: uuidv4(), title: '', description: '' }]);
    }
  };

  // Research paper management
  const addResearchPaper = () => {
    setResearchPapers([...researchPapers, { id: uuidv4(), title: '', url: '' }]);
  };

  const updateResearchPaper = (id: string, field: keyof ResearchPaper, value: string) => {
    setResearchPapers(researchPapers.map(paper => 
      paper.id === id ? { ...paper, [field]: value } : paper
    ));
  };

  const removeResearchPaper = (id: string) => {
    if (researchPapers.length > 1) {
      setResearchPapers(researchPapers.filter(paper => paper.id !== id));
    } else {
      // If it's the last one, just clear the fields
      setResearchPapers([{ id: uuidv4(), title: '', url: '' }]);
    }
  };

  const validateForm = () => {
    // Required fields validation
    if (!fullName || !collegeName || !course || !degree || !address) {
      toast.error('Please fill in all required basic information fields.');
      return false;
    }
    
    return true;
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
      const validHackathonDetails = filterEmptyItems(hackathonDetails);
      
      // Save profile details to Supabase
      if (user) {
        console.log('Saving profile data...');
        const profileData = {
          id: user.id,
          full_name: fullName,
          college_name: collegeName,
          course,
          degree,
          address,
          hackathon_participation: validHackathonDetails.length,
          hackathon_wins: validHackathonDetails.filter(h => h.won).length,
          hackathon_details: validHackathonDetails,
          cgpa,
          degree_completed: degreeCompleted,
          certifications: validCertifications,
          achievements: validAchievements,
          research_papers: validResearchPapers,
          profile_image: profileImageUrl,
          updated_at: new Date()
        };
        
        console.log('Profile data to save:', profileData);
        
        const { error } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (error) {
          console.error('Error saving profile:', error);
          throw new Error('Error saving profile: ' + error.message);
        }
        
        console.log('Profile saved successfully!');
      }

      // Call the update score API
      try {
        const scoreResponse = await fetch('https://solid-space-fishstick-w5v55x4ggxqf9w5w-8000.app.github.dev/update-score', {
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
            extras: achievements.length + researchPapers.length
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

              {/* Hackathon Details */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Hackathon Experience</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addHackathonDetail}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Hackathon
                  </Button>
                </div>

                {hackathonDetails.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No hackathons added. Click "Add Hackathon" to add your hackathon experiences.
                  </div>
                ) : (
                  hackathonDetails.map((hackathon, index) => (
                    <div key={hackathon.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2 mr-2">
                          <Label htmlFor={`hackathon-name-${index}`}>Hackathon Name</Label>
                          <Input
                            id={`hackathon-name-${index}`}
                            value={hackathon.name}
                            onChange={(e) => updateHackathonDetail(hackathon.id, 'name', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8"
                          onClick={() => removeHackathonDetail(hackathon.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`hackathon-date-${index}`}>Date</Label>
                          <Input
                            id={`hackathon-date-${index}`}
                            type="date"
                            value={hackathon.date}
                            onChange={(e) => updateHackathonDetail(hackathon.id, 'date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`hackathon-position-${index}`}>Position/Rank (optional)</Label>
                          <Input
                            id={`hackathon-position-${index}`}
                            value={hackathon.position || ''}
                            onChange={(e) => updateHackathonDetail(hackathon.id, 'position', e.target.value)}
                            placeholder="e.g., 1st Place, Runner-up"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id={`hackathon-won-${index}`}
                          checked={hackathon.won}
                          onCheckedChange={(checked) => updateHackathonDetail(hackathon.id, 'won', checked)}
                        />
                        <Label htmlFor={`hackathon-won-${index}`}>Won this hackathon</Label>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Certifications (Optional) */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Certifications (Optional)</h3>
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

              {/* Achievements (Optional) */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Achievements (Optional)</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addAchievement}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {achievements.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No achievements added. Click "Add" to add your achievements.
                  </div>
                ) : (
                  achievements.map((achievement, index) => (
                    <div key={achievement.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2 mr-2">
                          <Label htmlFor={`achievement-title-${index}`}>Title</Label>
                          <Input
                            id={`achievement-title-${index}`}
                            value={achievement.title}
                            onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8"
                          onClick={() => removeAchievement(achievement.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`achievement-description-${index}`}>Description</Label>
                        <Textarea
                          id={`achievement-description-${index}`}
                          value={achievement.description}
                          onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Research Papers (Optional) */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Research Papers (Optional)</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addResearchPaper}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {researchPapers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No research papers added. Click "Add" to add your research papers.
                  </div>
                ) : (
                  researchPapers.map((paper, index) => (
                    <div key={paper.id} className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2 mr-2">
                          <Label htmlFor={`paper-title-${index}`}>Paper Title</Label>
                          <Input
                            id={`paper-title-${index}`}
                            value={paper.title}
                            onChange={(e) => updateResearchPaper(paper.id, 'title', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8"
                          onClick={() => removeResearchPaper(paper.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`paper-url-${index}`}>URL</Label>
                        <Input
                          id={`paper-url-${index}`}
                          type="url"
                          value={paper.url}
                          onChange={(e) => updateResearchPaper(paper.id, 'url', e.target.value)}
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
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
