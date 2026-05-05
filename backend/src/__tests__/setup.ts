import mongoose from 'mongoose';

process.env.JWT_SECRET = 'test-secret-key';

const TEST_URI =
  process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/jest_test_db';

beforeAll(async () => {
  await mongoose.connect(TEST_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
