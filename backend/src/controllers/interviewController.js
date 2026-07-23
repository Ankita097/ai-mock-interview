import { getInterviews, createInterview, getInterviewById, updateInterview, deleteInterview, generateId, createCertificate, getCertificates } from '../config/memoryStore.js';
import crypto from 'crypto';

// Create new interview
export const createInterviewHandler = async (req, res) => {
  try {
    const interview = createInterview({
      ...req.body,
      user: req.user.id,
      questions: [],
      status: 'In Progress'
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's interviews
export const getInterviewsHandler = async (req, res) => {
  try {
    const interviews = getInterviews(req.user.id);
    res.status(200).json({ success: true, count: interviews.length, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single interview
export const getInterview = async (req, res) => {
  try {
    const interview = getInterviewById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update interview
export const updateInterviewHandler = async (req, res) => {
  try {
    const interview = updateInterview(req.params.id, req.body);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete interview
export const deleteInterviewHandler = async (req, res) => {
  try {
    const deleted = deleteInterview(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit interview answer
export const submitAnswer = async (req, res) => {
  try {
    const interview = getInterviewById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const { questionIndex, answer, aiFeedback, score } = req.body;

    if (interview.questions && interview.questions[questionIndex]) {
      interview.questions[questionIndex].userAnswer = answer;
      interview.questions[questionIndex].aiFeedback = aiFeedback;
      interview.questions[questionIndex].score = score;
    }

    updateInterview(req.params.id, { questions: interview.questions });

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete interview and generate feedback
export const completeInterview = async (req, res) => {
  try {
    const interview = getInterviewById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const { scores, feedback, suggestions, strengths, weaknesses, improvementPlan } = req.body;

    const updatedInterview = updateInterview(req.params.id, {
      overallScore: scores.overallScore,
      communicationScore: scores.communicationScore,
      confidenceScore: scores.confidenceScore,
      technicalScore: scores.technicalScore,
      problemSolvingScore: scores.problemSolvingScore,
      grammarScore: scores.grammarScore,
      vocabularyScore: scores.vocabularyScore,
      timeManagementScore: scores.timeManagementScore,
      feedback,
      suggestions,
      strengths,
      weaknesses,
      improvementPlan,
      status: 'Completed',
      completedAt: new Date(),
      duration: Math.floor(Math.random() * 30) + 10
    });

    // Generate certificate if score is good
    if (scores.overallScore >= 60) {
      const certificateId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      createCertificate({
        user: interview.user,
        interview: updatedInterview._id,
        certificateId,
        role: interview.role,
        company: interview.company,
        score: scores.overallScore,
        issuedAt: new Date()
      });

      updateInterview(req.params.id, { certificateId });
    }

    res.status(200).json({ success: true, data: updatedInterview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = getInterviews(userId).filter(i => i.status === 'Completed');

    const totalInterviews = interviews.length;
    const scores = interviews.map(i => i.overallScore || 0);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    const recentInterviews = interviews.slice(-5).reverse();

    res.status(200).json({
      success: true,
      data: {
        totalInterviews,
        averageScore,
        bestScore,
        recentInterviews,
        weakTopics: [{ category: 'System Design', averageScore: 55 }, { category: 'Database', averageScore: 58 }],
        strongTopics: [{ category: 'JavaScript', averageScore: 85 }, { category: 'React', averageScore: 82 }]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get certificates
export const getCertificatesHandler = async (req, res) => {
  try {
    const certificates = getCertificates(req.user.id);
    res.status(200).json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get performance data
export const getPerformanceData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        weeklyData: [],
        monthlyData: [],
        skillData: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};