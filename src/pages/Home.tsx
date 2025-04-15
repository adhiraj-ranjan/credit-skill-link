
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skill-blue mx-auto"></div>
          <p className="mt-4 text-skill-darkGray">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to profile if logged in
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  
  // If not logged in, display the home page content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-skill-blue">SkillHub</div>
          <div className="space-x-4">
            <a href="/login" className="text-skill-darkGray hover:text-skill-blue transition-colors">Login</a>
            <a href="/signup" className="bg-skill-blue text-white px-4 py-2 rounded hover:bg-skill-darkBlue transition-colors">Sign Up</a>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-skill-darkGray mb-6">Connect Your Skills with Opportunities</h1>
          <p className="text-xl text-gray-600 mb-10">Create your student profile, showcase your skills, and find the perfect job opportunities.</p>
          <a href="/signup" className="bg-skill-blue text-white text-lg px-8 py-3 rounded-lg hover:bg-skill-darkBlue transition-colors">Get Started</a>
        </div>
      </main>
    </div>
  );
};

export default Home;
