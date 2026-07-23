// In-memory data store for demo mode
export const inMemoryDB = {
  users: [
    {
      _id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user',
      isVerified: true,
      isSuspended: false,
      createdAt: new Date()
    }
  ],
  interviews: [],
  questions: [],
  certificates: [],
  categories: [
    { name: 'DSA', questionCount: 200 },
    { name: 'Java', questionCount: 150 },
    { name: 'React', questionCount: 100 },
    { name: 'Node', questionCount: 80 },
    { name: 'MongoDB', questionCount: 50 },
    { name: 'SQL', questionCount: 75 },
    { name: 'HR', questionCount: 50 },
    { name: 'Aptitude', questionCount: 100 },
    { name: 'Behavioral', questionCount: 60 },
  ]
};

// Helper to generate IDs
export const generateId = () => 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

// Find user by email
export const findUserByEmail = (email) => inMemoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());

// Find user by ID
export const findUserById = (id) => inMemoryDB.users.find(u => u._id === id);

// Create user
export const createUser = (userData) => {
  const newUser = { _id: generateId(), ...userData, createdAt: new Date() };
  inMemoryDB.users.push(newUser);
  return newUser;
};

// Get all interviews
export const getInterviews = (userId) => inMemoryDB.interviews.filter(i => i.user === userId);

// Create interview
export const createInterview = (data) => {
  const newInterview = {
    _id: generateId(),
    ...data,
    createdAt: new Date(),
    startedAt: new Date(),
    status: 'In Progress'
  };
  inMemoryDB.interviews.push(newInterview);
  return newInterview;
};

// Get interview by ID
export const getInterviewById = (id) => inMemoryDB.interviews.find(i => i._id === id);

// Update interview
export const updateInterview = (id, data) => {
  const index = inMemoryDB.interviews.findIndex(i => i._id === id);
  if (index !== -1) {
    inMemoryDB.interviews[index] = { ...inMemoryDB.interviews[index], ...data };
    return inMemoryDB.interviews[index];
  }
  return null;
};

// Delete interview
export const deleteInterview = (id) => {
  const index = inMemoryDB.interviews.findIndex(i => i._id === id);
  if (index !== -1) {
    inMemoryDB.interviews.splice(index, 1);
    return true;
  }
  return false;
};

// Get categories
export const getCategories = () => inMemoryDB.categories;

// Get questions
export const getQuestions = (query = {}) => {
  let questions = inMemoryDB.questions;
  if (query.category) {
    questions = questions.filter(q => q.category === query.category);
  }
  return questions;
};

// Create certificate
export const createCertificate = (data) => {
  const newCert = { _id: generateId(), ...data, createdAt: new Date() };
  inMemoryDB.certificates.push(newCert);
  return newCert;
};

// Get certificates
export const getCertificates = (userId) => inMemoryDB.certificates.filter(c => c.user === userId);