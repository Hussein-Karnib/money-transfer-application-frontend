export const validateEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  return /^\+?[\d\s-]{7,}$/.test(phone.trim());
};

export const validateAmount = (amount) => {
  const numeric = Number(amount);
  return !Number.isNaN(numeric) && numeric > 0;
};

