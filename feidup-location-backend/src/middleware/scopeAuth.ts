import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export interface ScopedRequest extends AuthRequest {
  scopedAdvertiserId?: string;
  scopedCafeId?: string;
}

// Auto-sets req.scopedAdvertiserId from token for advertiser users
export function scopeToAdvertiser(req: ScopedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  if (req.user.role === 'advertiser') {
    if (!req.user.advertiserId) {
      return res.status(403).json({ success: false, error: 'No advertiser linked to this account' });
    }
    req.scopedAdvertiserId = req.user.advertiserId;
  }
  next();
}

// Auto-sets req.scopedCafeId from token for restaurant users
export function scopeToCafe(req: ScopedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  if (req.user.role === 'restaurant') {
    if (!req.user.restaurantId) {
      return res.status(403).json({ success: false, error: 'No cafe linked to this account' });
    }
    req.scopedCafeId = req.user.restaurantId;
  }
  next();
}
