import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { config } from '../config/env';
import User from '../models/User';
import { isTokenBlacklisted } from '../services/tokenBlacklistService';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const toIssuedAtDate = (decoded: JwtPayload): Date | null => {
  if (typeof decoded.iat !== 'number') return null;
  return new Date(decoded.iat * 1000);
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }

    res.status(401).json({ success: false, message: 'Authentication failed' });
    return;
  }

  if (!decoded.userId || !Types.ObjectId.isValid(decoded.userId)) {
    res.status(401).json({ success: false, message: 'Malformed token payload' });
    return;
  }

  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    res.status(401).json({ success: false, message: 'Session revoked. Please login again.' });
    return;
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ success: false, message: 'User no longer exists' });
      return;
    }

    if (user.accountStatus === 'suspended') {
      res.status(403).json({ success: false, message: 'Account suspended. Please contact support.' });
      return;
    }

    if (user.accountStatus === 'deactivated') {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    const issuedAt = toIssuedAtDate(decoded);
    if (issuedAt && user.passwordChangedAt && issuedAt.getTime() < user.passwordChangedAt.getTime()) {
      res.status(401).json({ success: false, message: 'Password changed. Please login again.' });
      return;
    }

    if (issuedAt && user.tokenInvalidBefore && issuedAt.getTime() < user.tokenInvalidBefore.getTime()) {
      res.status(401).json({ success: false, message: 'Session invalidated. Please login again.' });
      return;
    }

    req.auth = { token, exp: decoded.exp };
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.accountStatus,
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
