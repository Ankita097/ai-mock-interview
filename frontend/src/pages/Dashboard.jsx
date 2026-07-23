import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlay, FiClock, FiTrendingUp, FiAward, FiArrowRight, FiTarget, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/interview/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set mock data for demo
      setStats({
        totalInterviews: 12,
        averageScore: 75,
        bestScore: 92,
        recentInterviews: [],
        weakTopics: [{ category: 'System Design', averageScore: 55 }, { category: 'Database', averageScore: 58 }],
        strongTopics: [{ category: 'JavaScript', averageScore: 85 }, { category: 'React', averageScore: 82 }]
      });
    } finally {
      setLoading(false);
    }
  };

  const scoreChartData = {
    labels: ['Communication', 'Confidence', 'Technical', 'Problem Solving', 'Grammar'],
    datasets: [{
      data: [75, 70, 80, 75, 85],
      backgroundColor: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  };

  const progressChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Score',
      data: [65, 72, 78, 85],
      backgroundColor: 'rgba(14, 165, 233, 0.8)',
      borderRadius: 8,
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-white/80">Ready to practice and improve your interview skills?</p>
          </div>
          <Link to="/start-interview" className="mt-4 md:mt-0 btn bg-white text-primary-600 hover:bg-gray-100">
            <FiPlay className="mr-2" /> Start New Interview
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FiPlay, label: 'Total Interviews', value: stats?.totalInterviews || 0, color: 'bg-blue-500' },
          { icon: FiTrendingUp, label: 'Average Score', value: stats?.averageScore || 0, color: 'bg-purple-500' },
          { icon: FiAward, label: 'Best Score', value: stats?.bestScore || 0, color: 'bg-green-500' },
          { icon: FiClock, label: 'Practice Hours', value: '24', color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="card flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <Bar data={progressChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Breakdown</h3>
          <div className="flex justify-center">
            <Doughnut data={scoreChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </motion.div>
      </div>

      {/* Topics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Areas to Improve</h3>
            <FiAlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {(stats?.weakTopics || [{ category: 'System Design', averageScore: 55 }, { category: 'Database', averageScore: 58 }]).map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <span className="font-medium text-gray-700">{topic.category}</span>
                <span className="text-red-600 font-semibold">{topic.averageScore}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Strong Topics</h3>
            <FiCheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {(stats?.strongTopics || [{ category: 'JavaScript', averageScore: 85 }, { category: 'React', averageScore: 82 }]).map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="font-medium text-gray-700">{topic.category}</span>
                <span className="text-green-600 font-semibold">{topic.averageScore}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/start-interview" className="card card-hover group flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiPlay className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Start Interview</h4>
            <p className="text-sm text-gray-500">Practice now</p>
          </div>
          <FiArrowRight className="ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
        </Link>

        <Link to="/practice" className="card card-hover group flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiTarget className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Practice Questions</h4>
            <p className="text-sm text-gray-500">Browse by topic</p>
          </div>
          <FiArrowRight className="ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
        </Link>

        <Link to="/resume-analysis" className="card card-hover group flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiAward className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Resume Analysis</h4>
            <p className="text-sm text-gray-500">Get AI feedback</p>
          </div>
          <FiArrowRight className="ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;