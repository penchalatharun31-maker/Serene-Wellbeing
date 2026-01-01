// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: 'user' | 'expert' | 'company' | 'super_admin';
      };
    }
  }
}

export {};
