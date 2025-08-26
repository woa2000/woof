// Validation utilities for forms and data
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function isValidPhone(phone) {
    // Brazilian phone number patterns
    const phoneRegex = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?9?\d{4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}
export function isValidCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11)
        return false;
    // Check for known invalid patterns
    if (/^(\d)\1{10}$/.test(cleanCPF))
        return false;
    // Calculate verification digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 >= 10)
        digit1 = 0;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 >= 10)
        digit2 = 0;
    return digit1 === parseInt(cleanCPF[9]) && digit2 === parseInt(cleanCPF[10]);
}
export function isValidCNPJ(cnpj) {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14)
        return false;
    // Check for known invalid patterns
    if (/^(\d)\1{13}$/.test(cleanCNPJ))
        return false;
    // Calculate verification digits
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanCNPJ[i]) * weights1[i];
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    sum = 0;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanCNPJ[i]) * weights2[i];
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return digit1 === parseInt(cleanCNPJ[12]) && digit2 === parseInt(cleanCNPJ[13]);
}
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
export function sanitizeString(str) {
    return str.trim().replace(/[<>]/g, '');
}
export function validatePassword(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/\d/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Senha deve conter pelo menos um caractere especial');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
//# sourceMappingURL=validation.js.map