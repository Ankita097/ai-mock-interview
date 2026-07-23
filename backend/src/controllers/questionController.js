import { getCategories, generateId } from '../config/memoryStore.js';

// Pre-populate questions
const sampleQuestions = [
  { _id: generateId(), category: 'DSA', question: 'Explain the difference between array and linked list.', difficulty: 'Easy', tags: ['Array', 'LinkedList'] },
  { _id: generateId(), category: 'Java', question: 'What is the difference between HashMap and Hashtable?', difficulty: 'Medium', tags: ['Java', 'Collections'] },
  { _id: generateId(), category: 'React', question: 'Explain the React component lifecycle methods.', difficulty: 'Medium', tags: ['React', 'Lifecycle'] },
  { _id: generateId(), category: 'Node', question: 'What is middleware in Express.js?', difficulty: 'Easy', tags: ['Node', 'Express'] },
  { _id: generateId(), category: 'SQL', question: 'What is the difference between INNER JOIN and LEFT JOIN?', difficulty: 'Easy', tags: ['SQL', 'Join'] },
  { _id: generateId(), category: 'HR', question: 'Tell me about yourself.', difficulty: 'Easy', tags: ['HR', 'Introduction'] },
  { _id: generateId(), category: 'DSA', question: 'Implement binary search algorithm.', difficulty: 'Medium', tags: ['Search', 'Algorithm'] },
  { _id: generateId(), category: 'System Design', question: 'Design a URL shortener service.', difficulty: 'Hard', tags: ['System Design'] },
];

// Initialize questions in memory store
import { inMemoryDB } from '../config/memoryStore.js';
inMemoryDB.questions = sampleQuestions;

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;

    let questions = inMemoryDB.questions;

    if (category) {
      questions = questions.filter(q => q.category === category);
    }

    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(q =>
        q.question.toLowerCase().includes(searchLower) ||
        q.tags?.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    const start = (page - 1) * limit;
    const paginatedQuestions = questions.slice(start, start + parseInt(limit));

    res.status(200).json({
      success: true,
      count: questions.length,
      total: questions.length,
      totalPages: Math.ceil(questions.length / limit),
      currentPage: parseInt(page),
      data: paginatedQuestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single question
export const getSingleQuestion = async (req, res) => {
  try {
    const question = inMemoryDB.questions.find(q => q._id === req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create question
export const createNewQuestion = async (req, res) => {
  try {
    const question = { _id: generateId(), ...req.body, createdAt: new Date() };
    inMemoryDB.questions.push(question);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update question
export const updateQuestionHandler = async (req, res) => {
  try {
    const index = inMemoryDB.questions.findIndex(q => q._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    inMemoryDB.questions[index] = { ...inMemoryDB.questions[index], ...req.body };
    res.status(200).json({ success: true, data: inMemoryDB.questions[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete question
export const deleteQuestionHandler = async (req, res) => {
  try {
    const index = inMemoryDB.questions.findIndex(q => q._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    inMemoryDB.questions.splice(index, 1);
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get categories
export const getAllCategories = async (req, res) => {
  try {
    res.status(200).json({ success: true, count: inMemoryDB.categories.length, data: inMemoryDB.categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category
export const createNewCategory = async (req, res) => {
  try {
    const category = { ...req.body, questionCount: 0 };
    inMemoryDB.categories.push(category);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get practice questions by category
export const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty, limit = 10 } = req.query;

    let questions = inMemoryDB.questions.filter(q => q.category === category);

    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    // Random selection
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, parseInt(limit));

    res.status(200).json({ success: true, count: selected.length, data: selected });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};