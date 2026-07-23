// AI Controller - Handles OpenAI/Gemini API calls

// Mock AI response for development (without actual API key)
const mockAIResponse = async (prompt) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    data: {
      message: "This is a simulated AI response for development purposes.",
      // Return some sample generated content based on prompt
      generatedContent: generateContentBasedOnPrompt(prompt)
    }
  };
};

// Generate content based on prompt type
const generateContentBasedOnPrompt = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('question') || lowerPrompt.includes('generate')) {
    return {
      questions: [
        "Tell me about yourself and why you're interested in this role.",
        "What are your greatest strengths and weaknesses?",
        "Describe a challenging project you've worked on.",
        "Where do you see yourself in 5 years?",
        "Why should we hire you?"
      ]
    };
  }

  if (lowerPrompt.includes('feedback') || lowerPrompt.includes('evaluate')) {
    return {
      communication: 75,
      confidence: 70,
      technical: 80,
      problemSolving: 75,
      grammar: 85,
      vocabulary: 80,
      overallScore: 77,
      feedback: "Good overall performance. Work on articulating your thoughts more clearly.",
      suggestions: [
        "Practice more behavioral questions using the STAR method",
        "Improve your body language and eye contact",
        "Research the company more thoroughly"
      ],
      strengths: [
        "Good technical knowledge",
        "Clear communication",
        "Problem-solving ability"
      ],
      weaknesses: [
        "Could improve on time management",
        "Need more confidence in answers"
      ],
      improvementPlan: "Focus on daily practice sessions and mock interviews to improve confidence."
    };
  }

  return { message: "Response generated successfully" };
};

// Generate interview questions
export const generateQuestions = async (req, res) => {
  try {
    const { role, difficulty, experience, interviewType } = req.body;

    // In production, use actual OpenAI API
    // For now, use mock response
    const prompt = `Generate ${interviewType} interview questions for a ${role} with ${experience} experience at ${difficulty} difficulty level`;

    const result = await mockAIResponse(prompt);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Evaluate interview answer
export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, type } = req.body;

    const prompt = `Evaluate this interview answer for question: ${question}
Answer: ${answer}
Type: ${type}`;

    const result = await mockAIResponse(prompt);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate AI feedback
export const generateFeedback = async (req, res) => {
  try {
    const { interview } = req.body;

    const prompt = `Generate comprehensive feedback for this mock interview:
Role: ${interview.role}
Company: ${interview.company}
Questions and Answers: ${JSON.stringify(interview.questions)}
Overall Performance: ${interview.overallScore || 'Not yet calculated'}`;

    const result = await mockAIResponse(prompt);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get AI recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { weakTopics, strongTopics, currentRole } = req.body;

    const prompt = `Based on these performance metrics:
Weak Topics: ${weakTopics}
Strong Topics: ${strongTopics}
Target Role: ${currentRole}

Provide personalized recommendations for improvement`;

    const result = await mockAIResponse(prompt);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Text to Speech (Web Speech API is used on frontend)
export const speechToText = async (req, res) => {
  try {
    // This would typically use a speech-to-text API
    // For now, return mock data
    res.status(200).json({
      success: true,
      data: {
        text: "This is a placeholder for speech-to-text conversion.",
        transcript: "The actual transcription would come from the Web Speech API on the frontend."
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Code execution (for coding interviews)
export const executeCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    // This would typically use a code execution API like Judge0
    // For now, return mock results

    res.status(200).json({
      success: true,
      data: {
        output: "Code execution simulated - in production, this would use an actual code execution API",
        language,
        testCasesPassed: testCases ? testCases.length : 0,
        testCasesTotal: testCases ? testCases.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};