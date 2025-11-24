const SECRET_KEY = 'MoneyTransfer@2025';

const normalizePayload = (payload) => {
  if (payload === undefined || payload === null) {
    return '';
  }
  return typeof payload === 'string' ? payload : JSON.stringify(payload);
};

export const basicEncrypt = (payload) => {
  const normalized = normalizePayload(payload);
  const keyCodes = SECRET_KEY.split('').map((char) => char.charCodeAt(0));

  return normalized
    .split('')
    .map((char, index) => {
      const charCode = char.charCodeAt(0);
      const keyCode = keyCodes[index % keyCodes.length];
      return (charCode ^ keyCode).toString(16).padStart(2, '0');
    })
    .join('');
};

export const basicDecrypt = (hexString) => {
  if (!hexString) return '';
  const keyCodes = SECRET_KEY.split('').map((char) => char.charCodeAt(0));
  const bytes = hexString.match(/.{1,2}/g) || [];

  return bytes
    .map((hex, index) => {
      const byte = parseInt(hex, 16);
      const keyCode = keyCodes[index % keyCodes.length];
      return String.fromCharCode(byte ^ keyCode);
    })
    .join('');
};

