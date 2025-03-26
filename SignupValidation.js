const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6; // Exemple simple
};

const validatePhoneNumber = (phone) => {
    const phonePattern = /^\d{10}$/; // Exemple : 10 chiffres pour un numéro de téléphone
    return phonePattern.test(phone);
};

export default { validateEmail, validatePassword, validatePhoneNumber };
