/**
 * @jest-environment node
 */
const mongoose = require('mongoose');
const Users = require('./users.js');

describe('Users model', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('creates a valid user with required fields', () => {
    const user = new Users({
      username: 'testuser',
      password: 'Test1234',
      hobbies: ['coding'],
    });
    expect(user.username).toBe('testuser');
  });

  test('requires a password field', () => {
    try {
      const user = new Users({
        username: 'nopassword',
        hobbies: ['gaming'],
      });
      user.validateSync();
    } catch (err) {
      expect(err.errors.password).toBeDefined();
    }
  });
});
