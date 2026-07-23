import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Question from '../models/Question.js';
import Company from '../models/Company.js';
import Category from '../models/Category.js';

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalCompanies = await Company.countDocuments();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);

    const recentInterviews = await Interview.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalInterviews,
        totalQuestions,
        totalCompanies,
        recentUsers,
        recentInterviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isSuspended } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, isSuspended },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete all user interviews
    await Interview.deleteMany({ user: user._id });

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend user
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User suspended', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unsuspend user
export const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User unsuspended', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });

    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create company
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const usersByDay = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    const interviewsByDay = await Interview.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    const interviewsByType = await Interview.aggregate([
      {
        $group: {
          _id: '$interviewType',
          count: { $sum: 1 }
        }
      }
    ]);

    const interviewsByRole = await Interview.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        usersByDay,
        interviewsByDay,
        interviewsByType,
        interviewsByRole
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};