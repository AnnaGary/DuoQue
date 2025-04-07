export function getSignupFormErrors(username, password, repeatpassword) {
    const errors = [];
  
    if (!username || username.trim() === '') {
      errors.push('Username is required');
    }
  
    if (!password || password.trim() === '') {
      errors.push('Password is required');
    }
  
    if (password !== repeatpassword) {
      errors.push('Passwords do not match');
    }
  
    return errors;
  }
  
  export function getLoginFormErrors(username, password) {
    const errors = [];
  
    if (!username || username.trim() === '') {
      errors.push('Username is required');
    }
  
    if (!password || password.trim() === '') {
      errors.push('Password is required');
    }
  
    return errors;
  }
  