import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export const ProgressComponent = () => {

    const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy the existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create a new chart
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Lectures', 'Assignments', 'Quizzes'],
            datasets: [{
              label: 'Progress',
              data: [85, 78, 92],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Your Overall Progress'
                
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount
    
  return (
  


    <div className=" mx-auto p-6 bg-[url('../../src/images/logo/background.png')] dark:bg-transparent shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-graydark dark:text-slate-50">Your Progress</h2>
      <canvas ref={chartRef}></canvas>
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Recent Activity</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-sm text-graydark dark:text-slate-50">Completed Quiz 3 - Score: 92%</li>
            <li className="text-sm text-graydark dark:text-slate-50">Submitted Assignment 2</li>
            <li className="text-sm text-graydark dark:text-slate-50">Attended Lecture 5</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Next Steps</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-sm text-graydark dark:text-slate-50">Quiz 4 due in 3 days</li>
            <li className="text-sm text-graydark dark:text-slate-50">Assignment 3 opens tomorrow</li>
            <li className="text-sm text-graydark dark:text-slate-50">Lecture 6 scheduled for next week</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
