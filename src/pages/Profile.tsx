
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { GraduationCap, User, Award, BookOpen, Trophy, FileText, Edit, LogOut, CalendarIcon } from 'lucide-react';
import { StudentProfile, CreditScoreResponse, HackathonDetail } from '@/types';
import { convertDbDataToProfile } from '@/utils/profileUtils';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreResponse | null>(null);

  // Chart colors
  const COLORS = ['#3B82F6', '#1E40AF', '#BFDBFE', '#60A5FA', '#93C5FD'];

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        
        // Fetch profile data from Supabase - using imported supabase client
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (data) {
          console.log('Profile data received:', data);
          
          // Transform DB data to our StudentProfile type using utility function
          const profileData = convertDbDataToProfile(data);
          setProfile(profileData);
          console.log('Profile transformed:', profileData);
          
          // Fetch credit score - UPDATED URL AND PARSING
          try {
            const studentId = parseInt(user.id, 36) % 10000; // Convert UUID to a numeric ID
            console.log('Fetching credit score for student ID:', studentId);
            const scoreResponse = await fetch(`https://skillcredit.pythonanywhere.com/get-score/${studentId}`);
            
            if (!scoreResponse.ok) {
              console.error('Failed to fetch credit score:', await scoreResponse.text());
              throw new Error('Failed to fetch credit score');
            }
            
            const scoreData = await scoreResponse.json();
            console.log('Credit score data:', scoreData);
            
            // Update to use the correct response format
            const creditScoreData: CreditScoreResponse = {
              id: studentId,
              score: scoreData['credit_score'] || 0,
              breakdown: {
                hackathon: scoreData.breakdown?.hackathon || 0,
                academic: scoreData.breakdown?.academic || 0,
                certifications: scoreData.breakdown?.certifications || 0,
                research: scoreData.breakdown?.research || 0,
                extras: scoreData.breakdown?.extras || 0,
              }
            };
            
            setCreditScore(creditScoreData);
          } catch (scoreError) {
            console.error('Error fetching credit score:', scoreError);
            toast.error('Could not load credit score. Please try again later.');
          }
        } else {
          // No profile found, redirect to setup
          console.log('No profile found, redirecting to setup');
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Error in profile fetching:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
          <p className="mt-4 text-skill-darkGray">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will be redirected in useEffect
  }

  // Prepare chart data
  const chartData = creditScore ? [
    { name: 'Academic', value: creditScore.breakdown.academic },
    { name: 'Hackathon', value: creditScore.breakdown.hackathon },
    { name: 'Certifications', value: creditScore.breakdown.certifications },
    { name: 'Research', value: creditScore.breakdown.research },
    { name: 'Extras', value: creditScore.breakdown.extras },
  ] : [];

  return (
    <div className="min-h-screen bg-skill-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-skill-blue" />
            <h1 className="text-3xl font-bold text-skill-darkGray">Student Profile</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/profile-setup')}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button
              variant="destructive"
              onClick={signOut}
              className="flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                <User className="h-5 w-5 text-skill-blue" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-skill-blue flex-shrink-0">
                    {profile.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.fullName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <GraduationCap className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-skill-darkGray">{profile.fullName}</h2>
                    <p className="text-gray-600">{profile.course} | {profile.collegeName}</p>
                    <p className="text-gray-600">{profile.address}</p>

                    <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                      <span className="px-3 py-1 bg-skill-lightBlue text-skill-blue rounded-full text-sm">
                        {profile.degree}
                      </span>
                      {profile.degreeCompleted && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Completed
                        </span>
                      )}
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        CGPA: {profile.cgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-3">
                      <Trophy className="h-5 w-5 mr-2 text-skill-blue" />
                      Hackathon Experience
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participations</span>
                        <span className="font-medium">{profile.hackathonParticipation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wins</span>
                        <span className="font-medium">{profile.hackathonWins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-medium">
                          {profile.hackathonParticipation > 0 
                            ? `${((profile.hackathonWins / profile.hackathonParticipation) * 100).toFixed(1)}%` 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-3">
                      <Award className="h-5 w-5 mr-2 text-skill-blue" />
                      Achievements
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certifications</span>
                        <span className="font-medium">{profile.certifications?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Achievements</span>
                        <span className="font-medium">{profile.achievements?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Research Papers</span>
                        <span className="font-medium">{profile.researchPapers?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hackathon Details */}
            {profile.hackathonDetails && profile.hackathonDetails.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">Hackathon Details</CardTitle>
                  <Trophy className="h-5 w-5 text-skill-blue" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.hackathonDetails.map((hackathon: HackathonDetail) => (
                      <div key={hackathon.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${hackathon.won ? 'border-green-300 bg-green-50' : ''}`}>
                        <h4 className="font-semibold">{hackathon.name}</h4>
                        {hackathon.position && (
                          <div className="text-sm text-gray-700 font-medium mt-1">{hackathon.position}</div>
                        )}
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {formatDate(hackathon.date)}
                        </div>
                        {hackathon.won && (
                          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Trophy className="h-3 w-3 mr-1" /> Winner
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">Certifications</CardTitle>
                  <Award className="h-5 w-5 text-skill-blue" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certifications.map((cert) => (
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
            )}

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">Achievements</CardTitle>
                  <Trophy className="h-5 w-5 text-skill-blue" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Research Papers */}
            {profile.researchPapers && profile.researchPapers.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">Research Papers</CardTitle>
                  <BookOpen className="h-5 w-5 text-skill-blue" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.researchPapers.map((paper) => (
                      <div key={paper.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <h4 className="font-semibold">{paper.title}</h4>
                        <a 
                          href={paper.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-skill-blue hover:underline text-sm mt-2 inline-block"
                        >
                          View Paper
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Credit Score */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Credit Score</CardTitle>
                <FileText className="h-5 w-5 text-skill-blue" />
              </CardHeader>
              <CardContent>
                {creditScore ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-block rounded-full bg-gray-100 p-4">
                        <div className="rounded-full bg-white p-6 shadow-lg">
                          <span className="text-4xl font-bold text-skill-blue">{creditScore.score}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-medium">Score Breakdown</h4>
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-2 text-left">
                      {Object.entries(creditScore.breakdown).map(([key, value], index) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            {key}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Credit score data is not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
