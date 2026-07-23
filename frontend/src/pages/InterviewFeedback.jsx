import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiDownload, FiArrowRight } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const InterviewFeedback = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedback({
        overallScore: 78,
        communicationScore: 80,
        confidenceScore: 75,
        technicalScore: 82,
        problemSolvingScore: 78,
        grammarScore: 85,
        vocabularyScore: 80,
        timeManagementScore: 70,
        feedback: 'Great interview! You demonstrated good technical knowledge and communication skills. Keep working on your confidence and time management.',
        suggestions: [
          'Practice more behavioral questions using the STAR method',
          'Improve your body language and eye contact',
          'Research the company more thoroughly',
          'Work on time management during coding questions'
        ],
        strengths: [
          'Good technical knowledge',
          'Clear communication',
          'Problem-solving ability',
          'Strong fundamentals'
        ],
        weaknesses: [
          'Need more confidence',
          'Time management needs improvement',
          'Could elaborate more on answers'
        ],
        improvementPlan: 'Focus on daily practice sessions and mock interviews. Spend 30 minutes daily on behavioral questions. Take online courses to improve specific technical areas.'
      });
      setLoading(false);
    }, 1500);
  }, [id]);

  const radarData = {
    labels: ['Communication', 'Confidence', 'Technical', 'Problem Solving', 'Grammar', 'Vocabulary', 'Time Management'],
    datasets: [{
      label: 'Your Score',
      data: [80, 75, 82, 78, 85, 80, 70],
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderColor: '#0ea5e9',
      pointBackgroundColor: '#0ea5e9',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#0ea5e9',
    }]
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Interview Complete! 🎉</h1>
            <p className="text-white/80">Java Developer Interview at Google</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-1">{feedback.overallScore}%</div>
            <p className="text-white/80">Overall Score</p>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
          <div className="flex justify-center">
            <Radar data={radarData} options={{ scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } } }} />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Communication', score: feedback.communicationScore },
              { label: 'Confidence', score: feedback.confidenceScore },
              { label: 'Technical Knowledge', score: feedback.technicalScore },
              { label: 'Problem Solving', score: feedback.problemSolvingScore },
              { label: 'Grammar', score: feedback.grammarScore },
              { label: 'Vocabulary', score: feedback.vocabularyScore },
              { label: 'Time Management', score: feedback.timeManagementScore },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className={`font-semibold ${getScoreColor(item.score)} w-12 text-right`}>{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5 text-primary-500" /> AI Feedback
        </h3>
        <p className="text-gray-600">{feedback.feedback}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-green-500" /> Strengths
          </h3>
          <ul className="space-y-3">
            {feedback.strengths.map((strength, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-orange-500" /> Areas to Improve
          </h3>
          <ul className="space-y-3">
            {feedback.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions</h3>
        <ul className="space-y-3">
          {feedback.suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600">
              <span className="mt-1 text-primary-500">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvement Plan */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Plan</h3>
        <p className="text-gray-600">{feedback.improvementPlan}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/my-interviews" className="flex-1 btn-secondary text-center">
          View All Interviews
        </Link>
        <Link to="/start-interview" className="flex-1 btn-primary text-center flex items-center justify-center gap-2">
          Start Another Interview <FiArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

export default InterviewFeedback;