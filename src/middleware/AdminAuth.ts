import { Request, Response, NextFunction } from 'express';

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

function requireAdminSelf(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.isAdminLoggedIn || !req.session.authenticatedAdmin) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const { adminId } = req.params;
  if (req.session.authenticatedAdmin.adminId !== adminId) {
    res.status(403).json({ error: 'Not authorized to access this resource' });
    return;
  }

  next();
}

export { requireAdmin, requireAdminSelf };
