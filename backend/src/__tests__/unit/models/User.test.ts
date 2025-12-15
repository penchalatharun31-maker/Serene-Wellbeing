import User from '../../../models/User';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '+1234567890',
        role: 'user' as const,
        dateOfBirth: new Date('1990-01-01')
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.phone).toBe(userData.phone);
      expect(user.role).toBe(userData.role);
      expect(user.isActive).toBe(true);
      expect(user.isEmailVerified).toBe(false);
    });

    it('should hash password before saving', async () => {
      const plainPassword = 'Password123!';
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: plainPassword,
        phone: '+1234567891',
        role: 'user',
        dateOfBirth: new Date('1992-01-01')
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(20);

      // Verify password is correctly hashed
      const isValid = await bcrypt.compare(plainPassword, user.password);
      expect(isValid).toBe(true);
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
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
        firstName: 'John'
        // Missing required fields
      });

      await expect(invalidUser.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
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
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '+1234567895',
        role: 'user',
        dateOfBirth: new Date('1990-01-01')
      });
    });

    it('should update last login timestamp', async () => {
      const beforeUpdate = user.lastLogin;

      await new Promise(resolve => setTimeout(resolve, 100));

      user.lastLogin = new Date();
      await user.save();

      expect(user.lastLogin.getTime()).toBeGreaterThan(beforeUpdate?.getTime() || 0);
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
    it('should create expert user with additional fields', async () => {
      const expertData = {
        firstName: 'Dr. Sarah',
        lastName: 'Smith',
        email: 'sarah@example.com',
        password: 'Password123!',
        phone: '+1234567896',
        role: 'expert' as const,
        dateOfBirth: new Date('1985-01-01'),
        specialization: ['Anxiety', 'Depression'],
        qualifications: ['PhD in Psychology'],
        experience: 10,
        bio: 'Experienced therapist',
        hourlyRate: 150
      };

      const expert = await User.create(expertData);

      expect(expert.role).toBe('expert');
      expect(expert.specialization).toEqual(expertData.specialization);
      expect(expert.qualifications).toEqual(expertData.qualifications);
      expect(expert.experience).toBe(expertData.experience);
      expect(expert.hourlyRate).toBe(expertData.hourlyRate);
    });
  });
});
