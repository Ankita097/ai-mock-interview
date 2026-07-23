import { findUserByEmail, findUserById, createUser, generateId, inMemoryDB } from '../config/memoryStore.js';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = createUser({
      name,
      email,
      password,
      role: 'user',
      isVerified: true,
      isSuspended: false
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    // Accept any password for demo
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Get current logged in user
export const getMe = async (req, res) => {
  try {
    // Try to find user by the ID from the token
    const userId = req.user?.id;
    let user = null;

    if (userId) {
      user = findUserById(userId);
    }

    // If no user found, return demo user
    if (!user) {
      // Check if demo user exists
      user = findUserById('demo-user-1');
      if (!user) {
        // Create demo user
        user = createUser({
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'demo123',
          role: 'user',
          isVerified: true,
          isSuspended: false
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto || ''
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        _id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      }
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user-1';
    const user = findUserById(userId);

    if (user) {
      Object.assign(user, req.body);
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(200).json({
        success: true,
        data: { _id: userId, ...req.body }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  res.status(200).json({ success: true, message: 'Password updated' });
};

// Forgot password
export const forgotPassword = async (req, res) => {
  res.status(200).json({ success: true, message: 'Password reset email sent' });
};

// Reset password
export const resetPassword = async (req, res) => {
  res.status(200).json({ success: true, message: 'Password reset successfully' });
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user._id + '-' + Math.random().toString(36).substr(2, 32);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto
    }
  });
};