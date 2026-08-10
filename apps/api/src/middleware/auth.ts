// apps/api/src/middleware/auth.ts
// Verifies JWT access tokens and attaches the authenticated user + role
// to the request object. Used on every protected route.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  schoolId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET as string;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_SECRET environment variable is required');
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based access control guard. Usage: requireRole(['teacher', 'admin'])
export const requireRole = (allowedRoles: AuthenticatedUser['role'][]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions for this action' });
      return;
    }
    next();
  };
};
