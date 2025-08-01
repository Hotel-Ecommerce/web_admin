import axios from 'axios';
let baseUrl = 'https://hotel-api.phuongtran.site';

if (process.env.NODE_ENV === 'development') {
  baseUrl = "http://localhost:7079"
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

console.log('axiosInstance created with baseURL:', api.defaults.baseURL);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // Gọi API refresh token đúng route backend
        const res = await api.post('/auth/refreshToken', {}, { withCredentials: true });
        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  config => {
    console.log('Request interceptor:', { url: config.url, method: config.method });
    // Không thêm token cho các route auth (so khớp tuyệt đối, không chỉ includes)
    const noAuthRoutes = [
      '/auth/login',
      '/auth/refreshToken',
      '/auth/signup',
      '/auth/signout',
      '/auth/changePassword'
    ];
    // So khớp tuyệt đối với pathname (không chỉ includes)
    const url = config.url || '';
    const isNoAuth = noAuthRoutes.some(route => url.endsWith(route));
    if (!isNoAuth) {
      const token = localStorage.getItem('token');
      console.log('Request interceptor - token from localStorage:', token ? 'Token exists' : 'No token');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
        console.log('Request interceptor - Authorization header set');
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api; 