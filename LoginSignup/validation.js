const form = document.getElementById('form')
const username_input = document.getElementById('username-input')
const password_input = document.getElementById('password-input')
const repeatpassword_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {
    //e.preventDefault() prevent submit
    let errors = []

    if(username_input){
        // If there is a username input then we are in the signup
        errors = getSignupFormErrors(username_input.value, password_input.value, repeatpassword_input.value)
    }
    else{
        // If there isnt a repeat password input we are in the login page
        errors = getLoginFormErrors(username_input.value, password_input.value)
    }

    if(errors.length > 0){
        e.preventDefault()
        error_message.innerText = errors.join(". ")
    }
} )

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