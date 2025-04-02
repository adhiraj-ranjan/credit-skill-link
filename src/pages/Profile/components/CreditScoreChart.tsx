
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { CreditScoreResponse } from '@/types';

interface CreditScoreChartProps {
  creditScore: CreditScoreResponse;
}

const CreditScoreChart: React.FC<CreditScoreChartProps> = ({ creditScore }) => {
  // State to hold the current display score during animation
  const [displayScore, setDisplayScore] = useState<number>(1);
  
  // Chart colors
  const COLORS = ['#3B82F6', '#1E40AF', '#BFDBFE', '#60A5FA', '#93C5FD'];
  
  // Prepare chart data
  const chartData = [
    { name: 'Academic', value: creditScore.breakdown.academic },
    { name: 'Hackathon', value: creditScore.breakdown.hackathon },
    { name: 'Certifications', value: creditScore.breakdown.certifications },
    { name: 'Research', value: creditScore.breakdown.research },
    { name: 'Extras', value: creditScore.breakdown.extras },
  ];

  // Effect to animate the score counting up
  useEffect(() => {
    // Reset to 1 whenever the actual score changes
    setDisplayScore(1);
    
    // Calculate animation duration based on the score value (higher = slightly longer)
    const duration = Math.min(1500, Math.max(1000, creditScore.score * 5));
    const stepTime = 15; // Update every 15ms for smooth animation
    const totalSteps = duration / stepTime;
    const increment = (creditScore.score - 1) / totalSteps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setDisplayScore(creditScore.score);
      } else {
        setDisplayScore((prev) => {
          const nextValue = prev + increment;
          return nextValue >= creditScore.score ? creditScore.score : nextValue;
        });
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [creditScore.score]);

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="inline-block rounded-full bg-gray-100 p-4">
          <div className="rounded-full bg-white p-6 shadow-lg">
            <span className="text-4xl font-bold text-skill-blue">
              {Math.round(displayScore)}
            </span>
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
  );
};

export default CreditScoreChart;
