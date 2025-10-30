import axios from 'axios';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: 'http://localhost:8888/api/v1',
});

// Verification client for token checks without side effects
const verificationClient = axios.create({
  baseURL: 'http://localhost:8888/api/v1',
});

// Add a request interceptor to attach the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to attach the token to verification requests
verificationClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors and mark unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[apiClient] 401 Unauthorized:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      });
      error.isUnauthorized = true;
    }
    return Promise.reject(error);
  }
);
// Response interceptor to handle 401 errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear localStorage on 401
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       // Redirect to login if not already there
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// Verification client does NOT redirect on 401 - just reject
// This allows App.jsx to handle token verification gracefully
verificationClient.interceptors.response.use(
  (response) => {
    console.log('✅ verificationClient: Success response', response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ verificationClient: Error response', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);


export { verificationClient };
export default apiClient;
