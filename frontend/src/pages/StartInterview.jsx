import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlay, FiArrowRight, FiCheck } from 'react-icons/fi';

const StartInterview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const roles = [
    'Java Full Stack Developer', 'Python Developer', 'React Developer', 'Node.js Developer',
    'MERN Stack Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'DevOps Engineer', 'AWS Engineer', 'Android Developer', 'iOS Developer'
  ];

  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Oracle', 'IBM', 'Other'];
  const experiences = ['Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const interviewTypes = [
    { value: 'HR', label: 'HR Interview' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Coding', label: 'Coding' },
    { value: 'Aptitude', label: 'Aptitude' },
    { value: 'Behavioral', label: 'Behavioral' },
    { value: 'System Design', label: 'System Design' },
    { value: 'DSA', label: 'DSA' },
    { value: 'Java', label: 'Java' },
    { value: 'React', label: 'React' },
    { value: 'Node', label: 'Node.js' },
  ];

  const selectedType = watch('interviewType');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/interview', {
        role: data.role,
        company: data.company,
        experience: data.experience,
        difficulty: data.difficulty,
        interviewType: data.interviewType,
        questions: []
      });
      navigate(`/interview/${res.data.data._id}`);
    } catch (error) {
      console.error('Error creating interview:', error);
      // Create mock interview for demo
      const mockId = 'demo-' + Date.now();
      navigate(`/interview/${mockId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Interview</h1>
        <p className="text-gray-600">Configure your mock interview settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Role *</label>
          <select {...register('role', { required: 'Please select a role' })} className="input-field">
            <option value="">Select a role</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          {errors.role && <p className="mt-1 text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Company</label>
          <select {...register('company')} className="input-field">
            <option value="">Select a company (optional)</option>
            {companies.map(company => <option key={company} value={company}>{company}</option>)}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
          <select {...register('experience', { required: 'Please select experience' })} className="input-field">
            <option value="">Select experience</option>
            {experiences.map(exp => <option key={exp} value={exp}>{exp}</option>)}
          </select>
          {errors.experience && <p className="mt-1 text-red-500 text-sm">{errors.experience.message}</p>}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map(diff => (
              <label key={diff} className="cursor-pointer">
                <input type="radio" {...register('difficulty', { required: true })} value={diff} className="peer sr-only" />
                <div className="px-4 py-3 text-center border-2 border-gray-200 rounded-xl peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                  <span className="font-medium text-gray-700 peer-checked:text-primary-600">{diff}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interviewTypes.map(type => (
              <label key={type.value} className="cursor-pointer">
                <input type="radio" {...register('interviewType', { required: 'Please select type' })} value={type.value} className="peer sr-only" />
                <div className="px-4 py-3 text-center border-2 border-gray-200 rounded-xl peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                  <span className="font-medium text-gray-700 peer-checked:text-primary-600 text-sm">{type.label}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.interviewType && <p className="mt-1 text-red-500 text-sm">{errors.interviewType.message}</p>}
        </div>

        {/* Features Info */}
        {selectedType === 'Coding' && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">📝 Coding Interview Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Integrated code editor with syntax highlighting</li>
              <li>• Support for Java, Python, C++, JavaScript, C</li>
              <li>• Run code with sample test cases</li>
              <li>• Timer for each question</li>
            </ul>
          </div>
        )}

        {selectedType === 'Voice' && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">🎤 Voice Interview Features</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Microphone enabled</li>
              <li>• Speech to text conversion</li>
              <li>• AI analysis of your answers</li>
              <li>• Real-time feedback</li>
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg flex items-center justify-center">
          {loading ? (
            <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> Creating Interview...</span>
          ) : (
            <><FiPlay className="mr-2" /> Start Interview</>
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Tips for a great interview</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Find a quiet place with good lighting</li>
          <li>• Ensure stable internet connection</li>
          <li>• Test your microphone before starting</li>
          <li>• Be confident and speak clearly</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default StartInterview;