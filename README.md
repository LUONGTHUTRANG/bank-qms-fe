# HỆ THỐNG XẾP HÀNG ĐỢI GIAO DỊCH NGÂN HÀNG

## 🎯 Công Nghệ Sử Dụng

- **Frontend Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS 4 (Responsive Design)
- **Animations**: Framer Motion (Smooth Transitions)
- **State Management**: Zustand (Global + Feature States)
- **Routing**: React Router v7
- **Build Tool**: Vite
- **API Client**: Axios (chuẩn bị)
- **Real-time**: Socket.io (chuẩn bị)

---

## 📦 Cấu Trúc Thư Mục

src/
│
├── assets/                 # (SHARED) Tài nguyên tĩnh
│   ├── images/             # Logo, ảnh nền Kiosk...
│   └── sounds/             # Tiếng chuông "Bính boong" khi gọi số
│
├── components/             # (SHARED) UI Components dùng chung (Dumb Components)
│   ├── ui/                 # Nơi chứa các component của shadcn/ui (Button, Modal, Table)
│   ├── form/               # Các component bọc ngoài React Hook Form (InputField, SelectField)
│   └── layout/             # Các component bố cục chung (Header, Sidebar)
│
├── hooks/                  # (SHARED) Custom Hooks dùng chung toàn hệ thống
│   ├── useWebSocket.js     # Hook lắng nghe Socket tổng
│   └── useWindowSize.js    # Hook kiểm tra kích thước màn hình
│
├── utils/                  # (SHARED) Hàm tiện ích thuần JS
│   ├── formatTime.js       # Format giờ phút giây
│   ├── cn.js               # Hàm gom class Tailwind (của shadcn/ui)
│   └── constants.js        # Các biến hằng số (VD: ROLES = { ADMIN: 'admin', STAFF: 'staff' })
│
├── services/               # (SHARED) Cấu hình giao tiếp hệ thống bên ngoài
│   ├── apiClient.js        # Cấu hình Axios instance (kèm interceptor gắn token)
│   └── socket.js           # Khởi tạo kết nối Socket.io
│
├── styles/                 # (SHARED) CSS toàn cục
│   └── globals.css         # Chứa @tailwind chỉ thị và các biến CSS mặc định
|
├── store/                  # GLOBAL STORES (Các trạng thái dùng ở bất cứ đâu)
│   ├── useAuthStore.ts     # Thông tin nhân viên, Token, Quyền hạn
│   ├── useSystemStore.ts   # Cài đặt hệ thống, Ngôn ngữ, Theme
│   └── useSocketStore.ts   # Trạng thái kết nối WebSocket
│
├── features/               # (CORE) LOGIC NGHIỆP VỤ - Trái tim của dự án
│   │
│   ├── kiosk/              # === TÍNH NĂNG MÀN HÌNH LẤY SỐ ===
│   │   ├── api/            # Hàm gọi API riêng của Kiosk (VD: createTicket)
│   │   ├── components/     # UI riêng của Kiosk (VD: ServiceCard to bản, TouchKeyboard)
│   │   ├── hooks/          # Logic riêng của Kiosk (VD: usePrintTicket, useIdleTimeout)
│   │   └── store/          # Zustand store riêng (VD: lưu trạng thái người dùng đang thao tác dở)
│   │
│   ├── counter/            # === TÍNH NĂNG NHÂN VIÊN QUẦY ===
│   │   ├── api/            # API gọi số, hủy số, hoàn thành
│   │   ├── components/     # UI riêng (VD: DraggableTicketCard để vuốt gọi số)
│   │   └── hooks/          # Hook xử lý logic hàng đợi
│   │
│   ├── admin/              # === TÍNH NĂNG QUẢN TRỊ VIÊN ===
│   │   ├── api/            # API CRUD dịch vụ, quầy, nhân viên
│   │   ├── components/     # Form cấu hình, Biểu đồ thống kê
│   │   └── hooks/          # useServiceManagement
│   │
│   └── display/            # === TÍNH NĂNG MÀN HÌNH TV ===
│       ├── components/     # UI hiển thị số to, hiệu ứng chạy chữ
│       └── hooks/          # Logic lắng nghe Socket để cập nhật số liên tục
│
├── pages/                  # LẮP RÁP CÁC TÍNH NĂNG THÀNH TRANG HOÀN CHỈNH
│   ├── kiosk/
│   │   ├── SelectServicePage.jsx
│   │   └── PrintSuccessPage.jsx
│   ├── admin/
│   │   └── DashboardPage.jsx
│   └── display/
│       └── TvBoardPage.jsx
│
├── routes/                 # Cấu hình định tuyến (React Router)
│   ├── AppRouter.jsx       # Router tổng
│   ├── ProtectedRoute.jsx  # Chặn người dùng không có quyền vào trang Admin
│   └── paths.js            # Lưu các đường dẫn (VD: KIOSK_HOME = '/kiosk')
│
├── App.jsx                 # Điểm vào chính của ứng dụng
└── main.jsx                # Render React vào DOM

---

## 🚀 Setup & Cách Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file `.env` từ `.env.example`
```bash
cp .env.example .env
# Cập nhật các giá trị nếu cần
```

### 3. Chạy development server
```bash
npm run dev
```
Truy cập: `http://localhost:5173`

### 4. Build production
```bash
npm run build
```

### 5. Lint code
```bash
npm lint
```

---

## 📁 Folder Organization

### **SHARED** (dùng chung toàn hệ thống)
- `components/` - UI Components (Button, Card, Modal...)
- `hooks/` - Custom Hooks (useWebSocket, useWindowSize...)
- `utils/` - Utility Functions (formatters, validators, helpers)
- `services/` - API Client, WebSocket Client
- `styles/` - Global CSS & Tailwind
- `constants/` - Constants (roles, endpoints, error codes)
- `types/` - Type Definitions
- `config/` - Configuration Files
- `store/` - Global Zustand Stores (auth, system, socket)

### **FEATURES** (core business logic)
Mỗi feature có cấu trúc độc lập:
- `api/` - API calls riêng của feature
- `components/` - UI components riêng của feature  
- `hooks/` - Custom hooks riêng của feature
- `types/` - Types riêng của feature
- `store/` - Zustand store riêng của feature
- `utils/` - Utils riêng của feature

**Features hiện có:**
- `kiosk/` - Màn hình lấy số
- `counter/` - Quầy giao dịch (staff)
- `admin/` - Quản trị viên
- `display/` - Màn hình hiển thị (TV board)

### **PAGES** (lắp ráp features thành trang)
- Ghép các components từ features thành trang hoàn chỉnh

### **ROUTES** (routing configuration)
- Router setup
- Protected routes
- Route paths constants

---

## 💡 Best Practices

### Import Patterns
```typescript
// ✅ Good - using @ alias
import { formatDate } from '@/utils'
import { useAuthStore } from '@/store'
import { ROLES } from '@/constants'

// ❌ Avoid - relative imports
import { formatDate } from '../../../utils'
```

### Using TailwindCSS
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <button className="btn-primary">Action</button>
</div>
```

### Using Zustand
```typescript
import { useAuthStore } from '@/store'

function MyComponent() {
  const { user, logout } = useAuthStore()
  return (/* JSX */)
}
```

### Using Framer Motion
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 📝 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useFormData.ts` |
| Utils functions | camelCase | `formatDate.ts` |
| Store | camelCase with `use` prefix | `useAuthStore.ts` |
| Types/Interfaces | PascalCase | `User.ts`, `UserState.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |

---

## 📚 Documentation

- [Cấu trúc chi tiết](./src/STRUCTURE_GUIDE.md) - Hướng dẫn cấu trúc dự án
- [TailwindCSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Zustand Docs](https://zustand-demo.vercel.app)
- [React Router Docs](https://reactrouter.com)

---

## 🔧 Environment Variables

Xem [.env.example](./.env.example) để các biến environment cần thiết.

---

## 🤝 Hướng Dẫn Phát Triển

### Thêm Feature Mới
1. Tạo folder `src/features/[new-feature]`
2. Tạo sub-folders: `api/`, `components/`, `hooks/`, `types/`, `store/`, `utils/`
3. Tạo `index.ts` (barrel export)
4. Implement feature logic
5. Integrate pages vào `src/pages/`

### Thêm Shared Component
1. Tạo file trong `src/components/ui/` hoặc `src/components/form/`
2. Tuân theo naming convention
3. Type everything chặt chẽ
4. Export từ `src/components/index.ts`

### Thêm Utility Function
1. Tạo file trong folder thích hợp (`validators/`, `formatters/`, `helpers/`)
2. Export từ `src/utils/index.ts`

---

**Sẵn sàng bắt đầu phát triển! 🚀**