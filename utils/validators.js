// * Validate Regeister input 

module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};

    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }
    if(email.trim() === ''){
        errors.email = 'Email must not be empty'
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email must be a valid email address'
        }
    }
    if(password === ''){
        errors.password = 'Password must Not Be Empty'
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    } else if(password.length < 8){
        errors.password = 'Password must be be at least 8 characters.'
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
}

// * Validate Login input
module.exports.validateLoginInput = (
    username,
    password
) => {
    const errors = {};

    if (username.trim() === "") {
      errors.username = "Username must not be empty";
    }
    if (password === "") {
      errors.password = "Password Must Not Be Empty";
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
}