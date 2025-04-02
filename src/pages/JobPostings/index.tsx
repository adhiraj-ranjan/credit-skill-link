
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ProfileLayout from '../Profile/components/ProfileLayout';
import { CreditScoreResponse } from '@/types';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship';
  description: string;
  requiredScore: number;
  postedDate: string;
  skills: string[];
}

const JobPostings = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock job postings data
  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Tech Innovations Inc.',
      location: 'Bangalore, India',
      type: 'Internship',
      description: 'Looking for a talented software engineering intern to join our dynamic team. Work on real-world projects using cutting-edge technologies.',
      requiredScore: 150,
      postedDate: '2023-09-15',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Analytics Hub',
      location: 'Remote',
      type: 'Internship',
      description: 'Join our data science team to analyze large datasets and build machine learning models for real-world business problems.',
      requiredScore: 170,
      postedDate: '2023-09-10',
      skills: ['Python', 'Machine Learning', 'SQL']
    },
    {
      id: '3',
      title: 'Frontend Developer',
      company: 'Digital Solutions',
      location: 'Mumbai, India',
      type: 'Full-time',
      description: 'Create responsive and interactive web applications as part of our growing development team.',
      requiredScore: 200,
      postedDate: '2023-09-05',
      skills: ['JavaScript', 'CSS', 'HTML', 'React']
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'Cloud Systems',
      location: 'Delhi, India',
      type: 'Full-time',
      description: 'Build scalable and robust backend systems using modern technologies and best practices.',
      requiredScore: 220,
      postedDate: '2023-08-28',
      skills: ['Java', 'Spring Boot', 'AWS']
    },
    {
      id: '5',
      title: 'UI/UX Design Intern',
      company: 'Creative Works',
      location: 'Hyderabad, India',
      type: 'Internship',
      description: 'Work with our design team to create beautiful and intuitive user interfaces for web and mobile applications.',
      requiredScore: 140,
      postedDate: '2023-09-20',
      skills: ['Figma', 'Adobe XD', 'UI/UX']
    },
    {
      id: '6',
      title: 'Mobile App Developer',
      company: 'Mobile Tech',
      location: 'Chennai, India',
      type: 'Part-time',
      description: 'Develop native mobile applications for iOS and Android platforms.',
      requiredScore: 180,
      postedDate: '2023-09-12',
      skills: ['React Native', 'iOS', 'Android']
    },
    {
      id: '7',
      title: 'DevOps Engineer',
      company: 'Infra Solutions',
      location: 'Pune, India',
      type: 'Full-time',
      description: 'Manage our infrastructure and deployment pipeline to ensure smooth operation of our services.',
      requiredScore: 250,
      postedDate: '2023-08-20',
      skills: ['Docker', 'Kubernetes', 'CI/CD']
    },
    {
      id: '8',
      title: 'Product Management Intern',
      company: 'Product Labs',
      location: 'Bangalore, India',
      type: 'Internship',
      description: 'Learn product management by working with our team on real product development lifecycle.',
      requiredScore: 160,
      postedDate: '2023-09-08',
      skills: ['Product Strategy', 'Agile', 'Market Research']
    }
  ];

  useEffect(() => {
    // Load applied jobs from localStorage
    const savedAppliedJobs = localStorage.getItem('appliedJobs');
    if (savedAppliedJobs) {
      setAppliedJobs(JSON.parse(savedAppliedJobs));
    }

    // Fetch credit score
    const fetchCreditScore = async () => {
      if (!user) return;
      
      try {
        const studentId = parseInt(user.id, 36) % 10000; // Convert UUID to a numeric ID
        console.log('Fetching credit score for student ID:', studentId);
        const scoreResponse = await fetch(`https://skillcredit.pythonanywhere.com/get-score/${studentId}`);
        
        if (!scoreResponse.ok) {
          console.error('Failed to fetch credit score:', await scoreResponse.text());
          throw new Error('Failed to fetch credit score');
        }
        
        const scoreData = await scoreResponse.json();
        setCreditScore(scoreData['credit_score'] || 0);
      } catch (error) {
        console.error('Error fetching credit score:', error);
        toast.error('Could not load credit score. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCreditScore();
  }, [user]);

  const handleApply = (jobId: string) => {
    const job = jobPostings.find(job => job.id === jobId);
    
    if (job && creditScore !== null) {
      if (creditScore >= job.requiredScore) {
        const newAppliedJobs = [...appliedJobs, jobId];
        setAppliedJobs(newAppliedJobs);
        localStorage.setItem('appliedJobs', JSON.stringify(newAppliedJobs));
        toast.success(`Applied to ${job.title} successfully!`);
      } else {
        toast.error(`Your credit score (${creditScore}) does not meet the required score (${job.requiredScore}) for this position.`);
      }
    } else {
      toast.error('Could not process your application. Please try again later.');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
          <p className="mt-4 text-skill-darkGray">Loading job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-8 w-8 text-skill-blue" />
          <h1 className="text-3xl font-bold text-skill-darkGray">Job Postings</h1>
        </div>
        {creditScore !== null && (
          <div className="text-lg font-medium text-skill-darkGray">
            Your Credit Score: <span className="text-skill-blue font-bold">{creditScore}</span>
          </div>
        )}
        <Button variant="outline" asChild className="flex items-center">
          <Link to="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobPostings.map((job) => (
          <Card key={job.id} className={`overflow-hidden ${creditScore !== null && creditScore >= job.requiredScore ? 'border-green-200' : 'border-orange-200'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="h-4 w-4 mr-1" /> {job.company}
                  </CardDescription>
                </div>
                <Badge className={job.type === 'Internship' ? 'bg-blue-500' : job.type === 'Part-time' ? 'bg-purple-500' : 'bg-green-500'}>
                  {job.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" /> {job.location}
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" /> Posted {formatDate(job.postedDate)}
              </div>
              <p className="text-gray-700 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-gray-100">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-sm font-medium mt-4">
                <span className="mr-2">Required Score:</span>
                <span 
                  className={`font-bold ${creditScore !== null && creditScore >= job.requiredScore ? 'text-green-600' : 'text-orange-600'}`}
                >
                  {job.requiredScore}
                </span>
                {creditScore !== null && (
                  <>
                    <span className="mx-1">•</span>
                    <span className={`${creditScore >= job.requiredScore ? 'text-green-600' : 'text-orange-600'}`}>
                      {creditScore >= job.requiredScore ? 'You qualify!' : 'Need higher score'}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                className="w-full" 
                disabled={appliedJobs.includes(job.id) || (creditScore !== null && creditScore < job.requiredScore)}
                onClick={() => handleApply(job.id)}
                variant={appliedJobs.includes(job.id) ? "secondary" : "default"}
              >
                {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ProfileLayout>
  );
};

export default JobPostings;
