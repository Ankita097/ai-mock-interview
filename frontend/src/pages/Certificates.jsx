import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiAward, FiDownload, FiCalendar, FiBriefcase, FiExternalLink } from 'react-icons/fi';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/interview/certificates');
      setCertificates(res.data.data);
    } catch (error) {
      // Mock data
      setCertificates([
        { _id: '1', certificateId: 'CERT-A1B2C3', role: 'Java Developer', company: 'Google', score: 85, issuedAt: new Date().toISOString() },
        { _id: '2', certificateId: 'CERT-D4E5F6', role: 'React Developer', company: 'Amazon', score: 78, issuedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600">Your interview completion certificates</p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12 card">
          <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-4">Complete interviews with 60%+ score to earn certificates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card relative overflow-hidden"
            >
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white mb-4">
                <div className="flex justify-between items-start mb-4">
                  <FiAward className="w-12 h-12" />
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{cert.certificateId}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Certificate of Completion</h3>
                <p className="text-white/80">Mock Interview</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{cert.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{cert.company}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-green-600 font-semibold">{cert.score}% Score</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="w-full mt-4 btn-primary flex items-center justify-center gap-2">
                <FiDownload /> Download PDF
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Certificates;