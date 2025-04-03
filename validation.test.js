import { getSignupFormErrors, getLoginFormErrors } from './validationLogic.js';

describe('Signup Form Validation', () => {
  test('should return error if username is empty', () => {
    const errors = getSignupFormErrors('', 'pass123', 'pass123');
    expect(errors).toContain('Username is required');
  });

  test('should return error if password is empty', () => {
    const errors = getSignupFormErrors('jaron', '', 'pass123');
    expect(errors).toContain('Password is required');
  });

  test('should return error if passwords do not match', () => {
    const errors = getSignupFormErrors('jaron', 'pass123', 'wrongpass');
    expect(errors).toContain('Passwords do not match');
  });

  test('should return no errors with valid input', () => {
    const errors = getSignupFormErrors('jaron', 'pass123', 'pass123');
    expect(errors.length).toBe(0);
  });
});

describe('Login Form Validation', () => {
  test('should return error if username is empty', () => {
    const errors = getLoginFormErrors('', 'pass123');
    expect(errors).toContain('Username is required');
  });

  test('should return error if password is empty', () => {
    const errors = getLoginFormErrors('jaron', '');
    expect(errors).toContain('Password is required');
  });

  test('should return no errors with valid input', () => {
    const errors = getLoginFormErrors('jaron', 'pass123');
    expect(errors.length).toBe(0);
  });
});
