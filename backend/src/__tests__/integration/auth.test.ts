import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth.routes';
import User from '../../models/User';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);

describe('Authentication Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'Password123!',
        phone: '+1234567891',
        dateOfBirth: '1990-01-01',
        role: 'user'
      };

      // Create user first
      await User.create(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'incomplete@example.com'
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'Password123!',
          phone: '+1234567892',
          dateOfBirth: '1990-01-01'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should enforce strong password requirements', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'weak@example.com',
          password: '123', // Weak password
          phone: '+1234567893',
          dateOfBirth: '1990-01-01'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/password/i);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '+1234567894',
        role: 'user',
        dateOfBirth: new Date('1990-01-01')
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should update lastLogin on successful login', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user?.lastLogin).toBeDefined();
      expect(user?.lastLogin).toBeInstanceOf(Date);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'reset@example.com',
        password: 'Password123!',
        phone: '+1234567895',
        role: 'user',
        dateOfBirth: new Date('1990-01-01')
      });
    });

    it('should send password reset email for valid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'reset@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/reset/i);
    });

    it('should not reveal if email does not exist', async () => {
      // For security, should still return success even if email doesn't exist
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
