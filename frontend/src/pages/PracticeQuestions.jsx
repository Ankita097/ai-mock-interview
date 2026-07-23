import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const PracticeQuestions = () => {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/question/categories');
      setCategories([{ name: 'All', questionCount: '1000+' }, ...res.data.data]);
    } catch (error) {
      setCategories([
        { name: 'All', questionCount: '1000+' },
        { name: 'DSA', questionCount: '200+' },
        { name: 'Java', questionCount: '150+' },
        { name: 'React', questionCount: '100+' },
        { name: 'Node', questionCount: '80+' },
        { name: 'MongoDB', questionCount: '50+' },
        { name: 'SQL', questionCount: '75+' },
        { name: 'HR', questionCount: '50+' },
        { name: 'Aptitude', questionCount: '100+' },
      ]);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === 'All' ? '' : `category=${selectedCategory}`;
      const res = await api.get(`/question?${categoryParam}&limit=50`);
      setQuestions(res.data.data);
    } catch (error) {
      // Mock questions
      setQuestions([
        { _id: '1', category: 'DSA', question: 'Explain the difference between array and linked list.', difficulty: 'Easy', tags: ['Array', 'LinkedList'] },
        { _id: '2', category: 'Java', question: 'What is the difference between HashMap and Hashtable?', difficulty: 'Medium', tags: ['Java', 'Collections'] },
        { _id: '3', category: 'React', question: 'Explain the React component lifecycle methods.', difficulty: 'Medium', tags: ['React', 'Lifecycle'] },
        { _id: '4', category: 'Node', question: 'What is middleware in Express.js?', difficulty: 'Easy', tags: ['Node', 'Express'] },
        { _id: '5', category: 'SQL', question: 'What is the difference between INNER JOIN and LEFT JOIN?', difficulty: 'Easy', tags: ['SQL', 'Join'] },
        { _id: '6', category: 'HR', question: 'Tell me about yourself.', difficulty: 'Easy', tags: ['HR', 'Introduction'] },
        { _id: '7', category: 'DSA', question: 'Implement binary search algorithm.', difficulty: 'Medium', tags: ['Search', 'Algorithm'] },
        { _id: '8', category: 'System Design', question: 'Design a URL shortener service.', difficulty: 'Hard', tags: ['System Design'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Questions</h1>
          <p className="text-gray-600">Prepare with thousands of interview questions</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.name
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                      {question.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{question.question}</p>
                  {question.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PracticeQuestions;