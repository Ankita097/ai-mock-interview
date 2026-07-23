import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCalendar, FiBarChart2, FiAward } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const Performance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPerformance({
        weeklyData: [
          { day: 'Mon', score: 65 },
          { day: 'Tue', score: 72 },
          { day: 'Wed', score: 78 },
          { day: 'Thu', score: 82 },
          { day: 'Fri', score: 75 },
          { day: 'Sat', score: 88 },
          { day: 'Sun', score: 85 },
        ],
        monthlyData: [
          { week: 'Week 1', score: 68 },
          { week: 'Week 2', score: 72 },
          { week: 'Week 3', score: 78 },
          { week: 'Week 4', score: 82 },
        ],
        skillsData: [
          { skill: 'DSA', score: 75 },
          { skill: 'Java', score: 82 },
          { skill: 'React', score: 78 },
          { skill: 'Node', score: 70 },
          { skill: 'MongoDB', score: 68 },
          { skill: 'SQL', score: 85 },
        ],
        interviewsByType: [
          { type: 'Technical', count: 8 },
          { type: 'HR', count: 5 },
          { type: 'Coding', count: 6 },
          { type: 'Behavioral', count: 4 },
        ],
        radarData: {
          labels: ['DSA', 'Java', 'React', 'Node', 'MongoDB', 'SQL', 'System Design'],
          data: [75, 82, 78, 70, 68, 85, 72]
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const lineChartData = {
    labels: performance?.weeklyData.map(d => d.day) || [],
    datasets: [{
      label: 'Score',
      data: performance?.weeklyData.map(d => d.score) || [],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const barChartData = {
    labels: performance?.skillsData.map(d => d.skill) || [],
    datasets: [{
      label: 'Score',
      data: performance?.skillsData.map(d => d.score) || [],
      backgroundColor: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'],
      borderRadius: 8,
    }]
  };

  const doughnutData = {
    labels: performance?.interviewsByType.map(d => d.type) || [],
    datasets: [{
      data: performance?.interviewsByType.map(d => d.count) || [],
      backgroundColor: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981'],
      borderWidth: 0,
    }]
  };

  const radarData = {
    labels: performance?.radarData.labels || [],
    datasets: [{
      label: 'Skills',
      data: performance?.radarData.data || [],
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderColor: '#0ea5e9',
      pointBackgroundColor: '#0ea5e9',
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track your progress over time</p>
        </div>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="input-field md:w-48">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: FiTrendingUp, label: 'Avg Score', value: '78%', color: 'bg-blue-500' },
          { icon: FiAward, label: 'Best Score', value: '92%', color: 'bg-green-500' },
          { icon: FiCalendar, label: 'Interviews', value: '23', color: 'bg-purple-500' },
          { icon: FiBarChart2, label: 'Improvement', value: '+15%', color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="card flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
          <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Performance</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Types</h3>
          <div className="flex justify-center">
            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Radar</h3>
          <div className="flex justify-center">
            <Radar data={radarData} options={{ scales: { r: { min: 0, max: 100 } } }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Performance;