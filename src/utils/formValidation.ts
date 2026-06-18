/**
 * Form Validation Utilities
 * Common validation functions for forms
 */

interface ValidationError {
  [key: string]: string;
}

/**
 * Validate username
 */
export function validateUsername(username: string): string {
  if (!username.trim()) return "Username harus diisi";
  if (username.length < 3) return "Username minimal 3 karakter";
  return "";
}

/**
 * Validate password
 */
export function validatePassword(password: string): string {
  if (!password.trim()) return "Password harus diisi";
  if (password.length < 6) return "Password minimal 6 karakter";
  return "";
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): string {
  if (!confirmPassword.trim()) return "Konfirmasi password harus diisi";
  if (password !== confirmPassword) return "Konfirmasi password tidak sama";
  return "";
}

/**
 * Validate login form
 */
export function validateLoginForm(
  username: string,
  password: string,
): ValidationError {
  const errors: ValidationError = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

/**
 * Validate register form
 */
export function validateRegisterForm(
  username: string,
  password: string,
  confirmPassword: string,
): ValidationError {
  const errors: ValidationError = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirmation(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
}

/**
 * Check if form has errors
 */
export function hasFormErrors(errors: ValidationError): boolean {
  return Object.values(errors).some((error) => error !== "");
}
