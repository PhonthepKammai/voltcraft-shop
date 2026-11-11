export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Returns 0-5
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

export const PASSWORD_STRENGTH_LABELS = [
  "",
  "Very Weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
] as const;