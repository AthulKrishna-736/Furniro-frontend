
export const validateFname = (firstName)=>{
    const usernamePattern = /^[a-zA-Z]{2,}$/
    const isValidFname = usernamePattern.test(firstName)
    return isValidFname ? '' : 'First name must contain only letters and be at least 2 characters long.'
}

export const validateLname = (lastName)=>{
    const usernamePattern = /^[a-zA-Z]{2,}$/
    const isValidLname = usernamePattern.test(lastName)
    return isValidLname ? '' : 'Last name must contain only letters and be at least 2 characters long.'
}

export const validateEmail = (email)=>{
    const emailPattern  = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/
    const isValidEmail = emailPattern.test(email)
    return isValidEmail ? '' : 'Please enter a valid email address.'
}

export const validatePass = (password)=>{
    const passPattern  = /^[a-zA-Z0-9_]{6,18}$/
    const isValidPass = passPattern.test(password)
    return isValidPass ? '' : 'Password must be at least 6 characters, including letters and numbers.'
}

export const validateFieldsReq = (formData)=>{
    const generalError = {}
    const hasEmptyField = Object.values(formData).some(value => !value);
    if(hasEmptyField){
        generalError.message = 'All fields are required'
        return generalError;
    }
    return null;
}

export const validateOtp = (otp)=>{
    const otpPattern = /^\d?$/;
    const errors = otp.map((digit)=>{
        return otpPattern.test(digit) ? '' : 'Only numbers are allowed'
    })

    const hasError = errors.some(error => error != '');
    return hasError ? errors : '';
};