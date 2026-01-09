/**
 * Bangladeshi phone number validation
 */

export const normalizeBangladeshiPhone = (phone) => {
  if (!phone) return '';
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  if (normalized.startsWith('+88')) {
    normalized = '0' + normalized.slice(3);
  } else if (normalized.startsWith('88')) {
    normalized = '0' + normalized.slice(2);
  }
  return normalized;
};

export const validateBangladeshiPhone = (phone) => {
  if (!phone) return false;
  const normalized = normalizeBangladeshiPhone(phone);
  return /^01[3-9]\d{8}$/.test(normalized);
};

export const getPhoneErrorMessage = () => {
  return "Invalid phone number. Use 01XXXXXXXXX or +8801XXXXXXXXX";
};

export const getPhonePlaceholder = () => {
  return "01XXXXXXXXX";
};

