
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
    const fieldErrors = {};
    if (!formData.firstName) fieldErrors.firstName = 'First Name is required';
    if (!formData.lastName) fieldErrors.lastName = 'Last Name is required';
    if (!formData.email) fieldErrors.email = 'Email is required';
    if (!formData.password) fieldErrors.password = 'Password is required';
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

export const validateOtp = (otp)=>{
    const otpPattern = /^\d?$/;
    const errors = otp.map((digit)=>{
        return otpPattern.test(digit) ? '' : 'Only numbers are allowed'
    })

    const hasError = errors.some(error => error != '');
    return hasError ? errors : '';
};

export const validateProductName = (name) => {
    const namePattern = /^[a-zA-Z0-9\- ]{2,}$/;
    const isValidName = namePattern.test(name);
    return isValidName ? '' : 'Product name must contain only letters and be at least 2 characters long.';
};

export const validateProductDescription = (description) => {
    if (!description) return 'Product description is required.';
    if (description.length < 10) return 'Product description must be at least 10 characters long.';
    return '';
};

export const validatePrice = (price) => {
    if (price === '' || price === null) return 'Price is required.';
    if (price <= 0) return 'Price must be greater than 0.';
    return '';
};

export const validateStockQuantity = (quantity) => {
    if (!quantity) return 'Stock quantity is required.';
    if (quantity < 1) return 'Stock quantity must be greater than 0.';
    return '';
};

export const validateCategoryName = (name) => {
    if (!name) return 'Category name is required.';
    const namePattern = /^[a-zA-Z\s]{2,}$/; 
    const isValid = namePattern.test(name);
    return isValid ? '' : 'Category name must contain only letters and be at least 2 characters long.';
  };
  
 export const validateCategoryDescription = (description) => {
    if (!description) return 'Description is required.';
    if (description.length < 10) return 'Description must be at least 10 characters long.';
    return '';
  };



  