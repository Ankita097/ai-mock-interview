import ResumeReport from '../models/ResumeReport.js';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

// Upload and analyze resume
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const file = req.file;
    const filePath = file.path;

    let extractedText = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      // For PDF files, we'd use pdf-parse in production
      // For now, use mock data
      extractedText = `
        JOHN DOE
        Software Developer

        EDUCATION
        Bachelor of Technology in Computer Science
        ABC University, 2020-2024

        EXPERIENCE
        Software Developer Intern
        XYZ Company, 2023-2024
        - Developed web applications using React.js and Node.js
        - Worked with MongoDB and SQL databases

        PROJECTS
        E-commerce Platform
        - Built a full-stack e-commerce application
        - Technologies: React, Node.js, MongoDB

        SKILLS
        JavaScript, React.js, Node.js, MongoDB, SQL, Python, Java
      `;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid file type. Please upload PDF or DOCX' });
    }

    // Analyze the extracted text
    const analysis = analyzeResumeText(extractedText);

    // Create resume report
    const resumeReport = await ResumeReport.create({
      user: req.user.id,
      fileName: file.originalname,
      ...analysis
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({ success: true, data: resumeReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analyze resume text
const analyzeResumeText = (text) => {
  const lowerText = text.toLowerCase();

  // Extract skills
  const skillKeywords = [
    'javascript', 'react', 'node', 'mongodb', 'sql', 'python', 'java', 'c++',
    'html', 'css', 'typescript', 'angular', 'vue', 'express', 'mongoose',
    'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'git', 'rest api', 'graphql', 'redux', 'next.js', 'flutter', 'django'
  ];

  const foundSkills = skillKeywords.filter(skill => lowerText.includes(skill));

  // Extract education
  const education = [];
  const eduPatterns = [
    /bachelor|be|b\.tech|m\.tech|phd|master/i,
    /university|college|institute/i,
    /202\d|201\d|200\d/
  ];

  if (eduPatterns.some(p => p.test(text))) {
    education.push({
      degree: 'Bachelor of Technology',
      institution: 'University',
      year: '2024'
    });
  }

  // Extract experience
  const experience = [];
  const expPatterns = [
    /intern|developer|engineer|manager|lead/i,
    /company|startup|corporate/i
  ];

  if (expPatterns.some(p => p.test(text))) {
    experience.push({
      title: 'Software Developer',
      company: 'Company',
      duration: '1 Year',
      description: 'Worked on various projects'
    });
  }

  // Extract projects
  const projects = [];
  const projectKeywords = ['project', 'application', 'platform', 'website', 'app'];

  if (projectKeywords.some(k => lowerText.includes(k))) {
    projects.push({
      name: 'Project',
      description: 'Developed various applications',
      technologies: foundSkills.slice(0, 5)
    });
  }

  // Calculate ATS score (simplified)
  let atsScore = 50;
  if (foundSkills.length > 5) atsScore += 10;
  if (education.length > 0) atsScore += 15;
  if (experience.length > 0) atsScore += 15;
  if (projects.length > 0) atsScore += 10;
  atsScore = Math.min(atsScore, 100);

  // Suggest missing skills
  const importantSkills = ['javascript', 'react', 'node', 'sql', 'git'];
  const missingSkills = importantSkills.filter(s => !foundSkills.includes(s));

  // Generate suggestions
  const suggestions = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding these in-demand skills: ${missingSkills.join(', ')}`);
  }
  if (atsScore < 70) {
    suggestions.push('Improve your ATS score by adding more quantifiable achievements');
  }
  if (experience.length === 0) {
    suggestions.push('Add work experience or internships to strengthen your resume');
  }

  return {
    atsScore,
    skills: foundSkills,
    education,
    experience,
    projects,
    missingSkills,
    suggestions,
    keywordOptimization: foundSkills.join(', ')
  };
};

// Get user's resume reports
export const getResumeReports = async (req, res) => {
  try {
    const reports = await ResumeReport.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single resume report
export const getResumeReport = async (req, res) => {
  try {
    const report = await ResumeReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Resume report not found' });
    }

    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete resume report
export const deleteResumeReport = async (req, res) => {
  try {
    const report = await ResumeReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Resume report not found' });
    }

    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await report.deleteOne();

    res.status(200).json({ success: true, message: 'Resume report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};