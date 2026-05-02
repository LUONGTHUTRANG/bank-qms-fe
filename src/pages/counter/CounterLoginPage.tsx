import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import backgroundImage from '@/assets/images/background-queuing.png';
import { authService } from '@/services/authService';
import { toast } from '@/stores/useToastStore';

export default function CounterLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !password) {
      toast.warning('Vui lòng nhập mã nhân viên và mật khẩu!', 'Cảnh báo');
      return;
    }

    setIsLoading(true);

    try {
      // API Login
      const res: any = await authService.login(empId, password);
      // Dựa vào cấu trúc JSON response mới cập nhật: res.data chứa accessToken
      const token = res?.data?.accessToken;
      const refreshToken = res?.data?.refreshToken;
      if (token) {
        localStorage.setItem('access_token', token);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
      }
      
      toast.success('Đăng nhập thành công', 'Chào mừng');
      
      // Navigate to where they came from or default to dashboard
      const from = location.state?.from?.pathname || '/counter';
      navigate(from, { replace: true });
    } catch (error: any) {
      // Chỉ hiển thị toast lỗi đăng nhập nếu đó là lỗi do server trả về.
      // Nếu không có response (ví dụ: máy chủ sập, mất mạng), axiosClient interceptor đã tự hiện toast "Mất kết nối".
      if (error.response) {
        // Cho login error, luôn hiển thị message tiếng Việt cố định (không dùng message từ server)
        const message = 'Tài khoản hoặc mật khẩu không chính xác.';
        
        toast.error(message, 'Đăng nhập thất bại');
        console.error('Login error:', error.response.data);
      } else {
        console.error('Login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[var(--color-surface)] overflow-hidden lg:h-screen h-[100dvh]">
      {/* Split Screen Layout */}
      <div className="flex w-full h-full lg:flex-row flex-col overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side: Login Form Canvas */}
        <main className="w-full lg:w-[45%] h-auto lg:h-full lg:min-h-0 flex flex-col justify-between px-6 py-6 lg:px-16 lg:py-12 bg-[#ffffff] z-10 shadow-[0_0_40px_0_rgba(25,28,32,0.04)] min-h-[100dvh] shrink-0">
          {/* Header Brand */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-4xl text-[#003063] font-bold">
              account_balance
            </span>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl tracking-tighter text-[#003063]">
                Azure Horizon
              </span>
              <span className="font-label text-xs text-[#737782] tracking-widest uppercase">
                Hệ thống Terminal
              </span>
            </div>
          </motion.header>

          {/* Login Container (Centered vertically) */}
          <section className="flex flex-col gap-8 lg:gap-10 w-full max-w-md mx-auto my-auto py-8">
            {/* Title Area */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col gap-2"
            >
              {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ededf4] rounded-full w-fit">
                <span className="material-symbols-outlined text-sm text-[#566067]">lock</span>
                <span className="font-label text-xs font-semibold text-[#424751]">
                  Khu vực Xác thực Bảo mật
                </span>
              </span> */}
              <h1 className="font-headline text-3xl lg:text-[2.5rem] leading-tight font-bold text-[#191c20] tracking-tight mt-2 lg:mt-4">
                Đăng nhập Hệ thống
              </h1>
              <p className="font-body text-[#424751] text-sm lg:text-base leading-relaxed">
                Vui lòng xác thực bằng thông tin đăng nhập hoặc thẻ nhân viên của bạn để truy cập hệ thống.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-6" 
              onSubmit={handleLogin}
            >
              <div className="flex flex-col gap-4">
                {/* Employee ID Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-sm font-medium text-[#191c20]" htmlFor="empId">
                    Mã nhân viên
                  </label>
                  <div className="relative flex items-center group">
                    <span className="material-symbols-outlined absolute left-4 text-[#737782] group-focus-within:text-[#003063] transition-colors">
                      badge
                    </span>
                    <input
                      className="w-full h-16 pl-12 pr-4 bg-[#f3f3fa] border-none rounded-lg text-[#191c20] font-body text-lg focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003063] focus:outline-none transition-all shadow-[0_0_40px_0_rgba(25,28,32,0.04)] placeholder:text-[#c2c6d2]"
                      id="empId"
                      placeholder="VD: AZ-8492"
                      type="text"
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-sm font-medium text-[#191c20]" htmlFor="password">
                    Mật khẩu
                  </label>
                  <div className="relative flex items-center group">
                    <span className="material-symbols-outlined absolute left-4 text-[#737782] group-focus-within:text-[#003063] transition-colors">
                      key
                    </span>
                    <input
                      className="w-full h-16 pl-12 pr-12 bg-[#f3f3fa] border-none rounded-lg text-[#191c20] font-body text-lg focus:bg-[#ffffff] focus:ring-2 focus:ring-[#003063] focus:outline-none transition-all shadow-[0_0_40px_0_rgba(25,28,32,0.04)] placeholder:text-[#c2c6d2]"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-4 text-[#737782] hover:text-[#191c20] focus:outline-none flex items-center justify-center cursor-pointer"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-5 h-5 cursor-pointer rounded border-[#737782] text-[#003063] focus:ring-[#003063] bg-[#ffffff]"
                    type="checkbox"
                  />
                  <span className="font-body text-sm text-[#424751] group-hover:text-[#191c20] transition-colors">Ghi nhớ thiết bị</span>
                </label>
                <a className="font-body text-sm font-semibold text-[#003063] hover:text-[#00468c] transition-colors" href="#">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Primary Action */}
              <motion.button
                whileHover={!isLoading ? { scale: 1.01 } : undefined}
                whileTap={!isLoading ? { scale: 0.98 } : undefined}
                disabled={isLoading}
                className={`bg-gradient-to-br from-[#003063] to-[#00468c] text-[#ffffff] font-headline font-semibold text-[1.1rem] rounded-xl h-14 lg:h-16 w-full mt-4 flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_0_rgba(25,28,32,0.04)]
                  ${isLoading ? 'opacity-80 cursor-not-allowed grayscale-[30%]' : 'hover:opacity-95 cursor-pointer'}`}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </section>

          {/* Footer Info */}
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between border-t-0 mt-8 pt-4 gap-2 sm:gap-0"
          >
            <span className="font-label text-[10px] sm:text-xs text-[#737782] text-center sm:text-left">Azure Horizon v4.2.1-stable</span>
            <a className="font-label text-[10px] sm:text-xs text-[#737782] flex items-center gap-1 hover:text-[#191c20] transition-colors" href="#">
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              Hỗ trợ IT
            </a>
          </motion.footer>
        </main>

        {/* Right Side: Architectural Background / Branding */}
        <aside className="hidden lg:flex flex-1 relative bg-[#ededf4] overflow-hidden">
          {/* Decorative Image */}
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center mix-blend-multiply bg-[#2a5ea5]"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          ></motion.div>

          {/* Subtle brand watermark */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-16 right-16 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-5xl text-[#191c20] font-light">
              terminal
            </span>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}