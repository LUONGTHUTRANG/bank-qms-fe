import axios from 'axios';
import { toast } from '@/stores/useToastStore';

// Bắt URL của Backend. Nếu không được khai báo trong file .env, mặc định sẽ là localhost:8080
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Có thể cài đặt timeout để hủy những request quá lâu
  timeout: 15000,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Không gán token cho các request thuộc về auth/login (Do request này không yêu cầu token)
    // Nếu bạn có thêm các API public khác như Đăng ký, Lấy mã OTP thì bổ sung vào condition này.
    const isLoginRequest = config.url?.includes('/v1/auth/login');

    if (!isLoginRequest) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Có thể bắt buộc return Promise.reject hoặc redirect Login nếu không có token. Phụ thuộc logic dự án
      }
    }

    // Thêm trường X-API-Key cho các request từ Kiosk (VITE_API_KEY cấu hình trong .env)
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    // Tất cả HTTP status code 2xx đều rơi vào vòng log này
    // Xử lý format, gỡ bọc data ở đây nếu API trả về một bọc chung thống nhất
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Tất cả HTTP status code ngoài 2xx đều rơi vào block lỗi này
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          return new Promise(function (resolve, reject) {
            axios.post(`${baseURL}/v1/auth/refresh`, { refreshToken })
              .then(({ data }) => {
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;
                localStorage.setItem('access_token', newAccessToken);
                localStorage.setItem('refresh_token', newRefreshToken);
                
                axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);
                resolve(axiosClient(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                window.location.href = '/counter/login'; // Redirect to login
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
           localStorage.removeItem('access_token');
           toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
           window.location.href = '/counter/login'; // Redirect to login
        }

      } else if (status === 403) {
        toast.warning("Bạn không có quyền truy cập vào khu vực này.", "Từ chối truy cập");
      } else if (status === 500) {
        toast.error("Hệ thống máy chủ đang gặp sự cố, vui lòng thử lại.", "Lỗi hệ thống");
      }
    } else {
      toast.error("Vui lòng kiểm tra lại đường truyền mạng hoặc liên hệ quản trị.", "Mất kết nối");
    }
    
    // Ném lỗi xuống nơi gọi request để xử lý tiếp
    return Promise.reject(error);
  }
);

export default axiosClient;
