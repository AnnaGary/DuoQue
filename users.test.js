import mongoose from 'mongoose';
import Users from './users.js';

const TEST_DB_URI = 'mongodb+srv://admin:admin@cluster0.g3l7o.mongodb.net/duoque_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
      }
      await mongoose.disconnect();
});

describe('Users Model', () => {
  test('should create a valid user', async () => {
    
    const newUser = await Users.create({
      username: 'testuser',
      password: 'secure123',
      bio: 'I love chess',
      hobbies: ['chess', 'coding'],
      location: 'Florida'
    });

    expect(newUser.username).toBe('testuser');
    expect(newUser.matches.length).toBe(0); 
    expect(newUser.createdAt).toBeDefined();
  });

  test('should fail without required fields', async () => {
    const invalidUser = new Users({});
    const error = invalidUser.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });  
});
