# 🔄 Hướng dẫn sử dụng tính năng Change Booking

## 📋 Tổng quan

Tính năng Change Booking cho phép khách hàng gửi yêu cầu thay đổi hoặc hủy booking, và Admin/Manager có thể phê duyệt hoặc từ chối các yêu cầu này.

## 🎯 Các tính năng chính

### 1. **Gửi yêu cầu thay đổi booking (Customer)**
- Khách hàng có thể gửi yêu cầu thay đổi thông tin booking (phòng, ngày check-in/check-out)
- Khách hàng có thể gửi yêu cầu hủy booking với lý do cụ thể
- Mỗi booking chỉ có thể có một yêu cầu đang chờ xử lý

### 2. **Quản lý yêu cầu thay đổi (Admin/Manager)**
- Xem danh sách tất cả yêu cầu thay đổi
- Lọc theo trạng thái: Chờ xử lý, Đã phê duyệt, Đã từ chối
- Phê duyệt hoặc từ chối yêu cầu với lý do cụ thể
- Tự động cập nhật booking khi phê duyệt

### 3. **Đánh dấu thanh toán**
- Admin/Manager có thể đánh dấu booking đã thanh toán
- Chỉ hiển thị cho các booking chưa thanh toán

## 🚀 Cách sử dụng

### **Cho Khách hàng:**

1. **Gửi yêu cầu thay đổi:**
   - Vào trang Quản lý đặt phòng
   - Nhấn nút "Yêu cầu thay đổi" (biểu tượng đổi) trên booking cần thay đổi
   - Chọn loại yêu cầu: "Thay đổi thông tin" hoặc "Hủy booking"
   - Điền thông tin mới hoặc lý do hủy
   - Nhấn "Gửi yêu cầu"

2. **Theo dõi trạng thái:**
   - Yêu cầu sẽ được gửi và chờ Admin/Manager phê duyệt
   - Hệ thống sẽ thông báo khi yêu cầu được xử lý

### **Cho Admin/Manager:**

1. **Xem yêu cầu thay đổi:**
   - Vào trang Quản lý đặt phòng
   - Nhấn nút "Quản lý yêu cầu thay đổi" (biểu tượng danh sách)
   - Hoặc truy cập trực tiếp trang "Quản lý yêu cầu thay đổi booking"

2. **Phê duyệt yêu cầu:**
   - Xem thông tin yêu cầu chi tiết
   - Nhấn "Phê duyệt" để chấp nhận yêu cầu
   - Hệ thống sẽ tự động cập nhật booking

3. **Từ chối yêu cầu:**
   - Nhấn "Từ chối" và nhập lý do từ chối
   - Yêu cầu sẽ được đánh dấu là "Đã từ chối"

4. **Đánh dấu thanh toán:**
   - Nhấn nút "Đánh dấu đã thanh toán" (biểu tượng check) trên booking
   - Trạng thái thanh toán sẽ được cập nhật thành "Paid"

## 🔧 Các API endpoints

### **Backend APIs:**
- `GET /bookings/bookingChangeRequests` - Lấy danh sách yêu cầu
- `POST /bookings/bookingChangeRequests/update` - Gửi yêu cầu thay đổi
- `POST /bookings/bookingChangeRequests/cancel` - Gửi yêu cầu hủy
- `PUT /bookings/bookingChangeRequests/:id/approve` - Phê duyệt yêu cầu
- `PUT /bookings/bookingChangeRequests/:id/disapprove` - Từ chối yêu cầu
- `PUT /bookings/markBookingPaid/:id` - Đánh dấu thanh toán

### **Frontend Components:**
- `BookingChangeRequestsModal` - Modal quản lý yêu cầu thay đổi
- `RequestBookingChangeModal` - Modal gửi yêu cầu thay đổi
- `BookingChangeRequestsPage` - Trang riêng quản lý yêu cầu

## 🛡️ Bảo mật và phân quyền

### **Customer:**
- ✅ Chỉ có thể gửi yêu cầu cho booking của chính mình
- ✅ Chỉ có thể xem booking của chính mình
- ❌ Không thể phê duyệt yêu cầu

### **Manager/Admin:**
- ✅ Có thể xem tất cả yêu cầu thay đổi
- ✅ Có thể phê duyệt/từ chối yêu cầu
- ✅ Có thể đánh dấu thanh toán cho mọi booking
- ✅ Có thể cập nhật booking trực tiếp

## 📊 Trạng thái và Workflow

### **BookingChangeRequest Status:**
- `Pending` - Chờ phê duyệt
- `Approved` - Đã phê duyệt
- `Disapproved` - Đã từ chối

### **Booking Status:**
- `Confirmed` - Đã xác nhận
- `Cancelled` - Đã hủy

### **Payment Status:**
- `Unpaid` - Chưa thanh toán
- `Paid` - Đã thanh toán
- `Refund Pending` - Chờ hoàn tiền

## ⚠️ Lưu ý quan trọng

1. **Xung đột booking:** Khi phê duyệt yêu cầu thay đổi, hệ thống sẽ tự động hủy các booking xung đột
2. **Validation:** Tất cả ngày tháng và thông tin phòng đều được validate kỹ lưỡng
3. **Audit trail:** Mọi thay đổi đều được ghi lại với thông tin người thực hiện và thời gian
4. **Real-time updates:** Danh sách booking sẽ được cập nhật ngay sau khi có thay đổi

## 🎨 UI/UX Features

- **Responsive design:** Hoạt động tốt trên mọi thiết bị
- **Intuitive icons:** Sử dụng icon trực quan cho các hành động
- **Status badges:** Hiển thị trạng thái rõ ràng với màu sắc phân biệt
- **Loading states:** Hiển thị trạng thái loading khi thực hiện các thao tác
- **Error handling:** Xử lý lỗi và hiển thị thông báo rõ ràng 