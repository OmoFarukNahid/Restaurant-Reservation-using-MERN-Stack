// controller/authController.js
import { User } from "../models/userSchema.js";

export const checkAuth = async (req, res) => {
  try {
    if (!req.session.isLoggedIn || !req.session.userId) {
      return res.json({ user: null });
    }
    
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({ user: null });
    }

    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.json({ user: null });
  }
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const user = await User.create({ name, email, password });
    
    // Set session data
    req.session.userId = user._id;
    req.session.isLoggedIn = true;

    res.status(201).json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      message: "Registration successful" 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message.includes('duplicate') ? 
        'Email already exists' : 'Registration failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session data
    req.session.userId = user._id;
    req.session.isLoggedIn = true;

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      message: "Logged in successfully" 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) throw err;
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ 
        success: true,
        message: "Logged out successfully" 
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(400).json({ message: "Logout failed" });
  }
};