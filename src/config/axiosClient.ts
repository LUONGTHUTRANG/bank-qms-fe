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
    // Tiền xử lý cấu hình của request ở đây trước khi đẩy lên server, ví dụ gán Token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Tất cả HTTP status code 2xx đều rơi vào vòng log này
    // Xử lý format, gỡ bọc data ở đây nếu API trả về một bọc chung thống nhất
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Tất cả HTTP status code ngoài 2xx đều rơi vào block lỗi này
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Handle lỗi Token hết hạn (401 Unauthorized)
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        // localStorage.removeItem('access_token');
        // Về trang đăng nhập (Có thể cần thêm hàm redirect ở react route)
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
