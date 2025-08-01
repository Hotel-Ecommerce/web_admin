
# 🖥️ Hệ Thống Quản Lý Khách Sạn - Web Admin

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Tổng Quan

Đây là hệ thống quản trị (Admin Dashboard) của Hệ thống Quản lý Khách sạn, được xây dựng bằng React.js. Ứng dụng này dành cho quản lý, nhân viên khách sạn sử dụng để quản lý toàn bộ nghiệp vụ: đặt phòng, phòng, khách hàng, nhân viên, yêu cầu thay đổi và thống kê báo cáo. Giao diện hiện đại, dễ sử dụng, tối ưu cho công việc quản trị nội bộ.

## 🚀 Tính Năng

### 🔐 Xác thực & Phân quyền
- Đăng nhập/đăng xuất an toàn
- Phân quyền truy cập (Admin, Quản lý, Nhân viên)
- Quản lý phiên làm việc

### 📊 Quản lý Đặt phòng
- Thêm, sửa, xóa, xem chi tiết đặt phòng
- Lọc và tìm kiếm nâng cao
- Quản lý trạng thái đặt phòng
- Lịch sử thay đổi

### 🏠 Quản lý Phòng
- Thêm, sửa, xóa thông tin phòng
- Upload và quản lý hình ảnh
- Cập nhật trạng thái phòng
- Phân loại phòng

### 👥 Quản lý Khách hàng
- Thông tin chi tiết khách hàng
- Lịch sử đặt phòng
- Thống kê khách hàng

### 👨‍💼 Quản lý Nhân viên (Admin only)
- Quản lý tài khoản nhân viên
- Phân quyền và vai trò
- Lịch sử hoạt động

### 📝 Quản lý Yêu cầu
- Xử lý yêu cầu thay đổi đặt phòng
- Xử lý yêu cầu hủy đặt phòng
- Theo dõi trạng thái yêu cầu

### 📈 Báo cáo & Thống kê
- Dashboard thời gian thực
- Biểu đồ và biểu đồ thống kê
- Xuất dữ liệu (Excel/CSV)
- Báo cáo chi tiết

## 🏗️ Công Nghệ Sử Dụng

### Frontend Framework
- **React.js 18.x** - Thư viện UI
- **React Router** - Điều hướng ứng dụng
- **React Bootstrap** - Component UI

### Styling & UI
- **SCSS Modules** - CSS preprocessor
- **React Icons** - Icon library

### HTTP Client & State Management
- **Axios** - HTTP client
- **React Context** - State management

### Development Tools
- **Create React App** - Build tool
- **ESLint** - Code linting
- **Jest** - Testing framework

## 📁 Cấu Trúc Dự Án

```
frontend/
├── public/                    # File tĩnh
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/            # Component tái sử dụng
│   │   ├── Button/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── ...
│   ├── context/              # React context
│   │   └── UserContext.jsx
│   ├── core/                 # Tiện ích cốt lõi
│   │   └── constant/
│   ├── features/             # Module chức năng
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── customers/
│   │   ├── employees/
│   │   ├── rooms/
│   │   └── statistics/
│   ├── layouts/              # Component bố cục
│   │   └── MainLayout.jsx
│   └── utils/                # Hàm tiện ích
│       └── dateUtils.js
├── package.json
└── README.md
```

## ⚡ Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js** phiên bản 16 trở lên
- **npm** hoặc **yarn**
- **Git**

### Cài Đặt

1. **Clone dự án:**
   ```bash
   git clone https://github.com/Hotel-Ecommerce/web_admin.git
   cd web_admin/frontend
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình môi trường:**
   ```bash
   # Tạo file .env từ .env.example (nếu có)
   cp .env.example .env
   ```

4. **Khởi chạy development server:**
   ```bash
   npm start
   # hoặc
   yarn start
   ```

5. **Mở trình duyệt:**
   - Truy cập [http://localhost:3000](http://localhost:3000)
   - Ứng dụng sẽ tự động reload khi có thay đổi

### Scripts có sẵn

```bash
# Khởi chạy development server
npm start

# Build cho production
npm run build


## 🧩 Các Component Chính

### 📊 Dashboard
- Thống kê thời gian thực
- Biểu đồ và báo cáo
- Tổng quan hệ thống

### 📅 Quản lý Đặt phòng
- Danh sách đặt phòng
- Thêm/sửa/xóa đặt phòng
- Lọc và tìm kiếm
- Chi tiết đặt phòng

### 🏠 Quản lý Phòng
- Danh sách phòng
- Thêm/sửa/xóa phòng
- Upload hình ảnh
- Quản lý trạng thái

### 👥 Quản lý Khách hàng
- Danh sách khách hàng
- Thông tin chi tiết
- Lịch sử đặt phòng

### 👨‍💼 Quản lý Nhân viên (Admin)
- Danh sách nhân viên
- Quản lý tài khoản
- Phân quyền

### 📝 Quản lý Yêu cầu
- Danh sách yêu cầu
- Xử lý yêu cầu
- Theo dõi trạng thái

### 📈 Thống kê & Báo cáo
- Báo cáo chi tiết
- Xuất dữ liệu
- Biểu đồ thống kê

## 🛡️ Bảo Mật

### Xác thực
- JWT (JSON Web Token)
- Session management
- Auto logout khi token hết hạn

### Phân quyền
- **Admin**: Toàn quyền truy cập
- **Quản lý**: Quản lý đặt phòng, phòng, khách hàng
- **Nhân viên**: Xem và cập nhật đặt phòng

### Bảo mật dữ liệu
- Validation đầu vào
- HTTPS enforcement

## 🧪 Kiểm Thử

### Chạy tests
```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm test -- --watch
```

### Cấu trúc tests
```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.jsx
│       └── ComponentName.test.js
└── features/
    └── featureName/
        ├── ComponentName.jsx
        └── ComponentName.test.js
```

## 📦 Build & Deployment

### Build cho Production
```bash
npm run build
```

### Kiểm tra build
```bash
npm run build
npx serve -s build
```

### Environment Variables
```bash
# Development
REACT_APP_API_URL=http://localhost:5000/api

# Production
REACT_APP_API_URL=https://api.hotelmanagement.com/api
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Port 3000 đã được sử dụng:**
   ```bash
   # Sử dụng port khác
   PORT=3001 npm start
   ```

2. **Lỗi dependencies:**
   ```bash
   # Xóa node_modules và cài lại
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Lỗi build:**
   ```bash
   # Xóa cache
   npm run build -- --reset-cache
   ```

### Commit Convention

```
feat: tính năng mới
fix: sửa lỗi
docs: cập nhật tài liệu
style: thay đổi style
refactor: refactor code
test: thêm tests
chore: cập nhật build tools
```

## 📄 Giấy Phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác Giả

- **Nhóm phát triển** - Hệ thống Quản lý Khách sạn
- **Email**: support@hotelmanagement.com
- **Website**: https://hotelmanagement.com

## 🙏 Cảm ơn

- [React](https://reactjs.org/) - Thư viện UI
- [React Bootstrap](https://react-bootstrap.github.io/) - Component library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## 📞 Liên Hệ

- **Email**: support@hotelmanagement.com
- **Website**: https://hotelmanagement.com
- **Issues**: [GitHub Issues](https://github.com/Hotel-Ecommerce/web_admin/issues)

---

*Đây là phần frontend của dự án Hệ thống Quản lý Khách sạn. Để xem backend và tài liệu đầy đủ, vui lòng xem [repository chính](https://github.com/Hotel-Ecommerce/web_admin).*
