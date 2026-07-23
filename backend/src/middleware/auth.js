// Protect routes - simplified for demo
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // For demo, create a mock user
    req.user = { id: 'demo-user-1', role: 'user' };
    return next();
  }

  try {
    // Extract user ID from token (format: userId-randomString)
    let userId = token;
    if (token.includes('-')) {
      userId = token.split('-')[0];
      if (!userId || userId.length < 5) {
        userId = 'demo-user-1';
      }
    }

    req.user = { id: userId, role: 'user' };
    next();
  } catch (error) {
    req.user = { id: 'demo-user-1', role: 'user' };
    next();
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`
      });
    }
    next();
  };
};