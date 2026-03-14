import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { config } from '../config/env';
import User from '../models/User';
import { addTokenToBlacklist } from '../services/tokenBlacklistService';
import { clearLoginAttemptRecord, recordFailedLoginAttempt } from '../middleware/authBruteForce';

const signToken = (userId: string): string =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] });

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email is already registered' });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user.id);

    res.status(201).json({ success: true, data: { token, user: user.toJSON() } });
  } catch (error) {
    next(error);
  }
};

export const checkEmailAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const email = String(req.query.email ?? '').trim().toLowerCase();
    const existingUser = await User.exists({ email });

    res.status(200).json({
      success: true,
      data: {
        email,
        available: !existingUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const bruteState = recordFailedLoginAttempt(req);
      const bruteMessage = bruteState.locked
        ? 'Too many failed login attempts. Account login is temporarily locked.'
        : `Invalid email or password. Remaining attempts: ${bruteState.remainingAttempts}`;

      res.status(401).json({ success: false, message: bruteMessage });
      return;
    }

    clearLoginAttemptRecord(req);

    const token = signToken(user.id);
    res.status(200).json({
      success: true,
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    const user = await User.findById(req.user?.id).select('+password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(401).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({ success: false, message: 'New password must be different from current password' });
      return;
    }

    user.password = newPassword;
    user.tokenInvalidBefore = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authToken = req.auth?.token;

    if (!authToken || !req.user?.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    await addTokenToBlacklist({
      token: authToken,
      userId: req.user.id,
      exp: req.auth?.exp,
      reason: 'logout',
    });

    res.status(200).json({ success: true, message: 'Logged out securely' });
  } catch (error) {
    next(error);
  }
};
