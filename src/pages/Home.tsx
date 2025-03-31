
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Award, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-skill-blue" />
            <h1 className="text-2xl font-bold text-skill-darkGray">SkillCredit</h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/login" className="text-skill-darkGray hover:text-skill-blue transition-colors">Login</Link>
            <Link to="/signup" className="text-skill-darkGray hover:text-skill-blue transition-colors">Sign Up</Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-skill-darkGray leading-tight">
                  Track Your Academic Success with <span className="text-skill-blue">SkillCredit</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  A decentralized skill-based credit system designed for students to showcase their achievements and build their academic profile.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="bg-skill-blue hover:bg-skill-darkBlue text-white">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <div className="animated-gradient h-80 w-full rounded-lg flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 w-4/5 shadow-lg">
                    <div className="flex items-center mb-4">
                      <Award className="h-10 w-10 text-white mr-3" />
                      <h3 className="text-2xl font-bold text-white">Credit Score Analytics</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/30 rounded p-3">
                        <p className="text-white font-bold text-xl">85%</p>
                        <p className="text-white text-sm">Academic</p>
                      </div>
                      <div className="bg-white/30 rounded p-3">
                        <p className="text-white font-bold text-xl">92%</p>
                        <p className="text-white text-sm">Skills</p>
                      </div>
                      <div className="bg-white/30 rounded p-3">
                        <p className="text-white font-bold text-xl">78%</p>
                        <p className="text-white text-sm">Research</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-skill-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-skill-darkGray">Key Features</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                SkillCredit provides a comprehensive platform for students to build and showcase their academic profiles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="inline-block p-3 bg-skill-lightBlue rounded-lg mb-4">
                  <GraduationCap className="h-6 w-6 text-skill-blue" />
                </div>
                <h3 className="text-xl font-semibold text-skill-darkGray mb-2">Academic Profile</h3>
                <p className="text-gray-600">
                  Build a comprehensive academic profile that showcases your educational background and achievements.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="inline-block p-3 bg-skill-lightBlue rounded-lg mb-4">
                  <Award className="h-6 w-6 text-skill-blue" />
                </div>
                <h3 className="text-xl font-semibold text-skill-darkGray mb-2">Achievement Tracking</h3>
                <p className="text-gray-600">
                  Record and showcase your certifications, hackathon participation, and research contributions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="inline-block p-3 bg-skill-lightBlue rounded-lg mb-4">
                  <BarChart3 className="h-6 w-6 text-skill-blue" />
                </div>
                <h3 className="text-xl font-semibold text-skill-darkGray mb-2">Credit Scoring</h3>
                <p className="text-gray-600">
                  Get a comprehensive credit score based on your academic and extracurricular achievements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-skill-darkGray py-8">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-xl font-bold">SkillCredit</h2>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SkillCredit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
