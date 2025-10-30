import { apiClient } from '../redux/apiClient';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, token: string}>}
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (response.data.success) {
      const { accessToken, user } = response.data.data;
      // Return token and user - Redux authSlice will handle localStorage
      return { user, token: accessToken };
    }

    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    throw error.response?.data?.message || 'Login request failed';
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verify token is valid
 * @returns {Promise<{valid: boolean}>}
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get('/auth/verify');
    return { valid: response.data.success };
  } catch (error) {
    return { valid: false };
  }
};

/**
 * Refresh token
 * @returns {Promise<{token: string}>}
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      return { token };
    }
    throw new Error('Token refresh failed');
  } catch (error) {
    logoutUser();
    throw error;
  }
};

/**
 * Register new user
 * @param {object} userData - User data {email, password, name}
 * @returns {Promise<{user: object, token: string}>}
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);

    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }

    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    throw error.response?.data?.message || 'Registration request failed';
  }
};

export default {
  loginUser,
  logoutUser,
  verifyToken,
  refreshToken,
  registerUser,
};
