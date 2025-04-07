const form = document.getElementById('form')
const username_input = document.getElementById('username-input')
const password_input = document.getElementById('password-input')
const repeatpassword_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

const isSignupPage = repeatpassword_input !== null;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let errors = [];

    if(isSignupPage){
        errors = getSignupFormErrors(username_input.value, password_input.value, repeatpassword_input.value);
    } else {
        errors = getLoginFormErrors(username_input.value, password_input.value);
    }

    if(errors.length > 0){
        error_message.innerText = errors.join(". ");
        return;
    }

    try {
        const userData = {
            username: username_input.value,
            password: password_input.value
        };
        
        const endpoint = isSignupPage ? '/api/users/signup' : '/api/users/login';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.user && data.user.role) {
                localStorage.setItem('role', data.user.role);
              } else {
                localStorage.setItem('role', 'user');
              }
            localStorage.setItem('username', userData.username);
            
            if (isSignupPage) {
                window.location.href = '/profile.html';
            } else {
                window.location.href = '/index.html';
            }
        } else {
            error_message.innerText = data.message || 'An error occurred';
        }
    } catch (error) {
        console.error('Error:', error);
        error_message.innerText = 'An error occurred. Please try again.';
    }
});

function getSignupFormErrors(username, password, repeatpassword){
    let errors = []

    if(username === '' || username == null){
        errors.push('Username is required')
        username_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
        errors.push(' Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    if(repeatpassword === '' || repeatpassword == null){
        errors.push(' Repeat Password is required')
        repeatpassword_input.parentElement.classList.add('incorrect')
    }
    if(password.length < 8){
        errors.push('Password must have at least 8 characters.')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password !== repeatpassword){
        errors.push('Password does not match repeated password')
        password_input.parentElement.classList.add('incorrect')
        repeatpassword_input.parentElement.classList.add('incorrect')
    }
    
    return errors;
}

function getLoginFormErrors(username, password){
    let errors = []

    if(username === '' || username == null){
        errors.push('Username is required')
        username_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
        errors.push(' Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [username_input, password_input, repeatpassword_input].filter(input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input' , () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})