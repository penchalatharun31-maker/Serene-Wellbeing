import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer | null = null;
export let mongoAvailable = false;

// Setup before all tests
beforeAll(async () => {
  // Check if external MongoDB is available via environment variable
  const externalMongoUri = process.env.MONGO_TEST_URI;

  if (externalMongoUri) {
    // Use external MongoDB for testing
    try {
      await mongoose.connect(externalMongoUri);
      mongoAvailable = true;
      console.log('Connected to external MongoDB for testing');
      return;
    } catch (error) {
      console.warn('Failed to connect to external MongoDB:', error);
    }
  }

  // Try to start in-memory MongoDB server with multiple fallback configurations
  const configs = [
    { version: '6.0.4', distro: 'ubuntu2004' },
    { version: '5.0.13', distro: 'ubuntu1804' },
    { version: '4.4.18', distro: 'ubuntu1804' },
  ];

  for (const config of configs) {
    try {
      process.env.MONGOMS_DISTRO = config.distro;
      mongoServer = await MongoMemoryServer.create({
        binary: { version: config.version },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      mongoAvailable = true;
      console.log(`MongoDB Memory Server started with ${config.version} (${config.distro})`);
      return;
    } catch (error) {
      console.warn(`Failed to start MongoDB ${config.version} (${config.distro}):`, (error as Error).message);
      if (mongoServer) {
        await mongoServer.stop().catch(() => {});
        mongoServer = null;
      }
    }
  }

  console.warn('⚠️  MongoDB not available - tests will be skipped');
  console.warn('To run database tests, either:');
  console.warn('  1. Set MONGO_TEST_URI environment variable to a running MongoDB instance');
  console.warn('  2. Install MongoDB locally');
  console.warn('  3. Use Docker: docker run -p 27017:27017 mongo:6.0');
}, 120000);

// Cleanup after all tests
afterAll(async () => {
  // Disconnect and stop the server
  if (mongoAvailable) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clear all collections after each test
afterEach(async () => {
  if (!mongoAvailable) {
    return; // Skip cleanup if MongoDB is not available
  }
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Helper function to check if MongoDB is available
export const isMongoAvailable = () => mongoAvailable;

// Helper to skip tests when MongoDB is not available
export const skipIfNoMongo = () => {
  if (!mongoAvailable) {
    console.warn('Skipping test - MongoDB not available');
  }
  return mongoAvailable ? test : test.skip;
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:5000/api/v1/auth/google/callback';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.CSRF_SECRET = 'test-csrf-secret';
process.env.REDIS_URL = 'redis://localhost:6379';
