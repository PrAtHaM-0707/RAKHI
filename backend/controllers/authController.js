const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};