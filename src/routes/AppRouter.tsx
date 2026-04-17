import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import KioskHomePage from '@/pages/kiosk/KioskHomePage';
import KioskSelectCustomerTypePage from '@/pages/kiosk/KioskSelectCustomerTypePage';
import KioskPhoneInputPage from '@/pages/kiosk/KioskPhoneInputPage';
import KioskChooseServicePage from '@/pages/kiosk/KioskChooseServicePage';
import KioskPrintingPage from '@/pages/kiosk/KioskPrintingPage';
import CounterLayout from '@/features/counter/layouts/CounterLayout';
import CounterDashboardPage from '@/pages/counter/CounterDashboardPage';
import CounterLoginPage from '@/pages/counter/CounterLoginPage';

// Các page khác sẽ import ở đây

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định, có thể chọn trang khác làm trang chủ sau này */}
        <Route path="/" element={<Navigate to="/kiosk" replace />} />
        
        {/* KIOSK ROUTES */}
        <Route path="/kiosk">
          <Route index element={<KioskHomePage />} />
          {/* Màn hình chọn loại khách hàng */}
          <Route path="select-customer" element={<KioskSelectCustomerTypePage />} />
          {/* Màn hình nhập số điện thoại */}
          <Route path="phone-input" element={<KioskPhoneInputPage />} />
          {/* Màn hình bento grid chọn dịch vụ giao dịch */}
          <Route path="choose-service" element={<KioskChooseServicePage />} />
          {/* Màn hình in phiếu */}
          <Route path="printing" element={<KioskPrintingPage />} />
        </Route>

        {/* COUNTER ROUTES (Staff) */}
        <Route path="/counter/login" element={<CounterLoginPage />} />
        <Route path="/counter" element={<CounterLayout />}>
          <Route index element={<CounterDashboardPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin">
          <Route index element={<div>Admin Dashboard</div>} />
        </Route>

        {/* DISPLAY ROUTES (TV) */}
        <Route path="/display">
          <Route index element={<div>TV Display</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}