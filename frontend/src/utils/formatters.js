/**
 * Format currency to VND format
 * @param {number} value - Amount to format
 * @returns {string} Formatted string like "1.000.000 ₫"
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format price to USD format
 * @param {number} value - Amount to format
 * @returns {string} Formatted string like "$1,234.56"
 */
export const formatUSD = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format number to VND with thousand separators
 * @param {number} value - Amount to format
 * @returns {string} Formatted string like "1.000.000 ₫"
 */
export const formatVND = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' ₫';
};

/**
 * Format date in Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date like "31/10/2025 14:30"
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Format date only without time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date like "31/10/2025"
 */
export const formatDateOnly = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

/**
 * Shorten ID to first 8 characters
 * @param {string} id - ID to shorten
 * @returns {string} Shortened ID
 */
export const shortenId = (id) => {
  if (!id) return 'N/A';
  return id.substring(0, 8) + '...';
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
