import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { isMongoAvailable } from '../../setup';

const describeIfMongo = isMongoAvailable() ? describe : describe.skip;

describeIfMongo('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '+1234567890',
        role: 'user' as const,
        dateOfBirth: new Date('1990-01-01')
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.phone).toBe(userData.phone);
      expect(user.role).toBe(userData.role);
      expect(user.isActive).toBe(true);
      expect(user.isVerified).toBe(false);
    });

    it('should hash password before saving', async () => {
      const plainPassword = 'Password123!';
      const user = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: plainPassword,
        phone: '+1234567891',
        role: 'user',
        dateOfBirth: new Date('1992-01-01')
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toBeDefined();
      expect(user.password!.length).toBeGreaterThan(20);

      // Verify password is correctly hashed
      const isValid = await bcrypt.compare(plainPassword, user.password!);
      expect(isValid).toBe(true);
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'Password123!',
        phone: '+1234567892',
        role: 'user' as const,
        dateOfBirth: new Date('1990-01-01')
      };

      await User.create(userData);

      await expect(User.create({
        ...userData,
        phone: '+1234567893'
      })).rejects.toThrow();
    });

    it('should require all mandatory fields', async () => {
      const invalidUser = new User({
        name: 'John'
        // Missing required fields (email, password)
      });

      await expect(invalidUser.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
        phone: '+1234567894',
        role: 'user' as const,
        dateOfBirth: new Date('1990-01-01')
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user: any;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '+1234567895',
        role: 'user',
        dateOfBirth: new Date('1990-01-01')
      });
    });

    it('should update user credits', async () => {
      const initialCredits = user.credits;

      user.credits = 100;
      await user.save();

      const savedUser = await User.findById(user._id);
      expect(savedUser?.credits).toBe(100);
      expect(savedUser?.credits).toBeGreaterThan(initialCredits);
    });

    it('should store preferences correctly', async () => {
      const preferences = {
        notifications: { email: true, push: false },
        theme: 'dark',
        language: 'en'
      };

      user.preferences = preferences;
      await user.save();

      const savedUser = await User.findById(user._id);
      expect(savedUser?.preferences).toEqual(preferences);
    });
  });

  describe('Expert Role', () => {
    it('should create user with expert role', async () => {
      const expertData = {
        name: 'Dr. Sarah Smith',
        email: 'sarah@example.com',
        password: 'Password123!',
        phone: '+1234567896',
        role: 'expert' as const,
        dateOfBirth: new Date('1985-01-01')
      };

      const expert = await User.create(expertData);

      expect(expert.role).toBe('expert');
      expect(expert.name).toBe(expertData.name);
      expect(expert.email).toBe(expertData.email);
      expect(expert.isActive).toBe(true);
    });
  });
});
