/**
 * Role utilities for managing USER, STAFF, ADMIN roles
 */

const VALID_ROLES = ['USER', 'STAFF', 'ADMIN'];
const ROLE_PRIORITY = {
  'ADMIN': 3,
  'STAFF': 2,
  'USER': 1
};

/**
 * Filter roles to only include valid roles (USER, STAFF, ADMIN)
 * @param {Array} roles - Array of roles from API
 * @returns {Array} - Filtered roles
 */
export const filterValidRoles = (roles) => {
  if (!roles || !Array.isArray(roles)) return [];
  
  return roles
    .map(r => typeof r === 'string' ? r : r.name)
    .filter(r => VALID_ROLES.includes(r));
};

/**
 * Get highest priority role from array
 * Priority: ADMIN > STAFF > USER
 * @param {Array} roles - Array of roles from API
 * @returns {String} - Highest priority role
 */
export const getHighestRole = (roles) => {
  const validRoles = filterValidRoles(roles);
  if (validRoles.length === 0) return 'USER';
  
  return validRoles.reduce((highest, current) => {
    const currentPriority = ROLE_PRIORITY[current] || 0;
    const highestPriority = ROLE_PRIORITY[highest] || 0;
    return currentPriority > highestPriority ? current : highest;
  });
};

/**
 * Check if user has required role
 * @param {Array} userRoles - User's roles from auth state
 * @param {Array} requiredRoles - Required roles to check
 * @returns {Boolean}
 */
export const hasRequiredRole = (userRoles, requiredRoles) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  
  const validUserRoles = filterValidRoles(userRoles);
  return requiredRoles.some(required => 
    validUserRoles.includes(required)
  );
};

/**
 * Get role display label
 * @param {String} role - Role name
 * @returns {String} - Display label
 */
export const getRoleLabel = (role) => {
  const labels = {
    'ADMIN': 'ADMIN',
    'STAFF': 'STAFF',
    'USER': 'USER'
  };
  return labels[role] || role;
};

/**
 * Get role display color
 * @param {String} role - Role name
 * @returns {String} - Color name for Tag component
 */
export const getRoleColor = (role) => {
  const colors = {
    'ADMIN': 'red',
    'STAFF': 'blue',
    'USER': 'green'
  };
  return colors[role] || 'default';
};

export { VALID_ROLES, ROLE_PRIORITY };
