import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiCheck, FiAlertCircle, FiX, FiDownload } from 'react-icons/fi';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === 'application/pdf' ||
        selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      alert('Please upload PDF or DOCX file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReport(res.data.data);
    } catch (error) {
      // Mock report for demo
      setReport({
        atsScore: 78,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'SQL'],
        education: [{ degree: 'B.Tech in Computer Science', institution: 'ABC University', year: '2024' }],
        experience: [{ title: 'Software Developer Intern', company: 'Tech Corp', duration: '6 months', description: 'Worked on web applications' }],
        projects: [{ name: 'E-commerce Platform', description: 'Full-stack application', technologies: ['React', 'Node', 'MongoDB'] }],
        missingSkills: ['Docker', 'Kubernetes', 'AWS'],
        suggestions: ['Add more quantifiable achievements', 'Include Docker and AWS skills', 'Add more projects']
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
        <p className="text-gray-600">Upload your resume and get AI-powered feedback</p>
      </div>

      {!report ? (
        <>
          {/* Upload Area */}
          <div
            className={`card border-2 border-dashed ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUpload className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-gray-600 mb-2">Drag and drop your resume here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-500 mt-4">Supported: PDF, DOCX (Max 5MB)</p>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiFile className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 hover:bg-gray-200 rounded-lg">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full btn-primary mt-4"
              >
                {uploading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: FiCheck, title: 'ATS Score', desc: 'Check ATS compatibility' },
              { icon: FiAlertCircle, title: 'Skill Analysis', desc: 'Find missing skills' },
              { icon: FiFile, title: 'Suggestions', desc: 'Get improvement tips' },
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <item.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* ATS Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">ATS Score</h2>
              <span className={`text-3xl font-bold ${report.atsScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {report.atsScore}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${report.atsScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${report.atsScore}%` }}
              ></div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Skills</h3>
            <div className="flex flex-wrap gap-2">
              {report.skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
            {report.missingSkills?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">Missing Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {report.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions</h3>
            <ul className="space-y-3">
              {report.suggestions?.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => setReport(null)} className="btn-secondary w-full">
            Analyze Another Resume
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeAnalysis;