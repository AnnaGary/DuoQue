/**
 * @jest-environment jsdom
 */
const { getSignupFormErrors, getLoginFormErrors } = require('./validation.js');

describe('Form Validation', () => {
  test('getSignupFormErrors returns error for empty username', () => {
    const errors = getSignupFormErrors('', 'Password123', 'Password123');
    expect(errors).toContain('Username is required');
  });

  test('getSignupFormErrors returns error when passwords do not match', () => {
    const errors = getSignupFormErrors('user', 'Password123', 'WrongPass');
    expect(errors).toContain('Password does not match repeated password');
  });

  test('getLoginFormErrors returns error for empty username', () => {
    const errors = getLoginFormErrors('', 'Password123');
    expect(errors).toContain('Username is required');
  });
});
