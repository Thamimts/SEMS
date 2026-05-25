const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { generateOTP, isOTPValid } = require('../utils/helpers');

class AuthController {
  /**
   * Register new user
   */
  static async register(req, res, next) {
    try {
      const { name, email, phone, password, role = 'driver' } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user
      const user = new User({
        name,
        email,
        phone,
        password,
        role,
        isVerified: false,
      });

      await user.save();

      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON(),
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request OTP
   */
  static async requestOTP(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.otpCode = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // In production, send OTP via email/SMS
      console.log(`[AUTH] OTP for ${email}: ${otp}`);

      res.json({
        message: 'OTP sent to your email',
        // In development only, remove in production
        ...(process.env.NODE_ENV === 'development' && { otp }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email }).select('+otpCode +otpExpiry');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check OTP validity
      if (!isOTPValid(user.otpExpiry) || user.otpCode !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Mark as verified
      user.isVerified = true;
      user.otpCode = null;
      user.otpExpiry = null;
      await user.save();

      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        message: 'OTP verified successfully',
        user: user.toJSON(),
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }

      // Verify refresh token (simplified - in production use JWT verification)
      const decoded = require('jsonwebtoken').verify(
        refreshToken,
        process.env.JWT_SECRET || 'dev-secret-key'
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newToken = generateToken(user);

      res.json({
        token: newToken,
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { name, phone, bloodGroup, emergencyContacts, profileImage } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(bloodGroup && { bloodGroup }),
          ...(emergencyContacts && { emergencyContacts }),
          ...(profileImage && { profileImage }),
          updatedAt: new Date(),
        },
        { new: true }
      );

      res.json({
        message: 'Profile updated',
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  static async logout(req, res, next) {
    try {
      // In a real system, you might invalidate the token here
      res.json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
