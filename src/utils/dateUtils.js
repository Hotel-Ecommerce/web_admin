/**
 * Utility functions for date formatting
 */

/**
 * Format date to dd/mm/yyyy format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date and time to dd/mm/yyyy HH:mm format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format date for input type="date" (yyyy-mm-dd)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for input
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get current date in dd/mm/yyyy format
 * @returns {string} Current date string
 */
export const getCurrentDate = () => {
  return formatDate(new Date());
};

/**
 * Get current date and time in dd/mm/yyyy HH:mm format
 * @returns {string} Current date and time string
 */
export const getCurrentDateTime = () => {
  return formatDateTime(new Date());
}; 