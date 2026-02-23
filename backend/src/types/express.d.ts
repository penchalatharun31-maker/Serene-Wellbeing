import { IUser } from '../models/User';

declare global {
  namespace Express {
    // Extending Express.User so that req.user has all IUser properties everywhere
    // This is the correct Passport.js + TypeScript pattern
    interface User extends IUser {}
  }
}

export {};
