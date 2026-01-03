const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'hr') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = { auth, isAdmin };
