const form = document.getElementById('form');
const username_input = document.getElementById('username-input');
const password_input = document.getElementById('password-input');
const repeatpassword_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

if (form) {
  form.addEventListener('submit', (e) => {
    let errors = [];

    if (username_input) {
      errors = getSignupFormErrors(username_input.value, password_input.value, repeatpassword_input.value);
    } else {
      errors = getLoginFormErrors(username_input.value, password_input.value);
    }

    if (errors.length > 0) {
      e.preventDefault();
      error_message.innerText = errors.join('. ');
    }
  });
}

function getSignupFormErrors(username, password, repeatpassword) {
  let errors = [];

  if (username === '' || username == null) {
    errors.push('Username is required');
    if (username_input && username_input.parentElement) {
      username_input.parentElement.classList.add('incorrect');
    }
  }
  if (password === '' || password == null) {
    errors.push(' Password is required');
    if (password_input && password_input.parentElement) {
      password_input.parentElement.classList.add('incorrect');
    }
  }
  if (repeatpassword === '' || repeatpassword == null) {
    errors.push(' Repeat Password is required');
    if (repeatpassword_input && repeatpassword_input.parentElement) {
      repeatpassword_input.parentElement.classList.add('incorrect');
    }
  }
  if (password.length < 8) {
    errors.push('Password must have at least 8 characters.');
    if (password_input && password_input.parentElement) {
      password_input.parentElement.classList.add('incorrect');
    }
  }
  if (password !== repeatpassword) {
    errors.push('Password does not match repeated password');
    if (password_input && password_input.parentElement) {
      password_input.parentElement.classList.add('incorrect');
    }
    if (repeatpassword_input && repeatpassword_input.parentElement) {
      repeatpassword_input.parentElement.classList.add('incorrect');
    }
  }
  return errors;
}

function getLoginFormErrors(username, password) {
  let errors = [];

  if (username === '' || username == null) {
    errors.push('Username is required');
    if (username_input && username_input.parentElement) {
      username_input.parentElement.classList.add('incorrect');
    }
  }
  if (password === '' || password == null) {
    errors.push(' Password is required');
    if (password_input && password_input.parentElement) {
      password_input.parentElement.classList.add('incorrect');
    }
  }
  return errors;
}

const allInputs = [username_input, password_input, repeatpassword_input].filter(input => input != null);
allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect');
      error_message.innerText = '';
    }
  });
});

module.exports = {
  getSignupFormErrors,
  getLoginFormErrors,
};
