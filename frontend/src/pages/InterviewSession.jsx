import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiPlay, FiPause, FiSkipForward, FiCheck, FiClock, FiMessageSquare, FiCode } from 'react-icons/fi';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Write your code here\n\n');
  const recognitionRef = useRef(null);

  const questions = [
    { question: 'Tell me about yourself and why you are interested in this role.', category: 'HR', type: 'voice' },
    { question: 'What are your greatest strengths and weaknesses?', category: 'Behavioral', type: 'voice' },
    { question: 'Describe a challenging project you have worked on.', category: 'Technical', type: 'voice' },
    { question: 'Where do you see yourself in 5 years?', category: 'HR', type: 'voice' },
    { question: 'Why should we hire you?', category: 'HR', type: 'voice' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInterview({
        _id: id,
        role: 'Java Developer',
        company: 'Google',
        difficulty: 'Medium',
        interviewType: 'Technical',
        questions: questions.map(q => ({ ...q, userAnswer: '', aiFeedback: '', score: 0 }))
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setAnswer(transcript);
      };
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setAnswer('');
      setTimeLeft(120);
    } else {
      // Finish interview
      navigate(`/interview/${id}/feedback`);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{interview?.role}</h1>
            <p className="text-gray-400 text-sm">{interview?.company} • {interview?.difficulty}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 30 ? 'bg-red-500/20 text-red-400' : 'bg-gray-700'}`}>
              <FiClock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
              {questions[currentQuestion].category}
            </span>
            {questions[currentQuestion].type === 'voice' ? (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                <FiMic className="w-3 h-3" /> Voice
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                <FiCode className="w-3 h-3" /> Coding
              </span>
            )}
          </div>
          <h2 className="text-2xl font-semibold">{questions[currentQuestion].question}</h2>
        </motion.div>

        {/* Answer Area */}
        {questions[currentQuestion].type === 'voice' ? (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 min-h-[200px]">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use voice input..."
                className="w-full bg-transparent text-white resize-none outline-none min-h-[180px]"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
              >
                {isRecording ? <><FiMicOff /> Stop Recording</> : <><FiMic /> Start Recording</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm text-gray-400 flex justify-between">
              <span>Java</span>
              <button className="text-primary-400 hover:text-primary-300">Run Code</button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-gray-800 text-white p-4 font-mono outline-none"
              rows={15}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestion(c => Math.max(0, c - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-700 rounded-xl disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-primary-500 rounded-xl flex items-center gap-2 hover:bg-primary-600"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
            <FiSkipForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;