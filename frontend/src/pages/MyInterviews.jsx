import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiAward, FiEye, FiTrash2, FiDownload } from 'react-icons/fi';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interview');
      setInterviews(res.data.data);
    } catch (error) {
      // Mock data
      setInterviews([
        { _id: '1', role: 'Java Developer', company: 'Google', difficulty: 'Medium', interviewType: 'Technical', overallScore: 85, status: 'Completed', completedAt: new Date().toISOString(), duration: 25 },
        { _id: '2', role: 'React Developer', company: 'Amazon', difficulty: 'Hard', interviewType: 'Coding', overallScore: 72, status: 'Completed', completedAt: new Date(Date.now() - 86400000).toISOString(), duration: 35 },
        { _id: '3', role: 'Full Stack Developer', company: 'Microsoft', difficulty: 'Medium', interviewType: 'HR', overallScore: 0, status: 'In Progress', startedAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await api.delete(`/interview/${id}`);
        setInterviews(interviews.filter(i => i._id !== id));
      } catch (error) {
        setInterviews(interviews.filter(i => i._id !== id));
      }
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || interview.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score > 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
          <p className="text-gray-600">View and manage your interview history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field md:w-48">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in progress">In Progress</option>
        </select>
      </div>

      {/* Interview List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interviews...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-12 card">
          <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600 mb-4">Start your first mock interview!</p>
          <Link to="/start-interview" className="btn-primary">Start Interview</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview, index) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{interview.role}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(interview.overallScore)}`}>
                    {interview.overallScore > 0 ? `${interview.overallScore}%` : interview.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{interview.company || 'General'}</span>
                  <span>•</span>
                  <span>{interview.difficulty}</span>
                  <span>•</span>
                  <span>{interview.interviewType}</span>
                  {interview.duration && (
                    <>
                      <span>•</span>
                      <span className="flex items-center"><FiClock className="mr-1" />{interview.duration} min</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {interview.status === 'Completed' ? (
                  <>
                    <Link to={`/interview/${interview._id}/feedback`} className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                      <FiEye className="w-5 h-5" />
                    </Link>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <Link to={`/interview/${interview._id}`} className="btn-primary text-sm py-2">
                    Continue
                  </Link>
                )}
                <button onClick={() => deleteInterview(interview._id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyInterviews;