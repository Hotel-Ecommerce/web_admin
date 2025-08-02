# Statistics Dashboard

## Tổng quan

Trang thống kê được thiết kế để hoạt động với backend hiện tại. Do backend chỉ có API `/statistics/bookings`, frontend sẽ tính toán các thống kê khác từ dữ liệu booking, rooms, customers và requests.

## Mock Data

Để đảm bảo trang thống kê hoạt động ngay cả khi backend chưa sẵn sàng, chúng tôi đã thêm hệ thống mock data toàn diện:

### Cấu trúc Mock Data

File `mockData.js` chứa tất cả dữ liệu mẫu:

- **Comprehensive Statistics**: Thống kê tổng hợp về booking, revenue, customer, room, requests
- **Real-time Statistics**: Dữ liệu thời gian thực (hôm nay)
- **Booking Statistics**: Dữ liệu booking theo ngày (30 ngày gần nhất)
- **Room Type Statistics**: Thống kê theo loại phòng
- **Customer Statistics**: Thống kê khách hàng theo tháng
- **Revenue Trends**: Xu hướng doanh thu theo tuần
- **Top Rooms**: Danh sách phòng có hiệu suất cao nhất
- **Payment Statistics**: Thống kê thanh toán và phương thức thanh toán
- **Cancellation Reasons**: Lý do hủy đặt phòng
- **Customer Satisfaction**: Đánh giá và xếp hạng của khách hàng
- **Seasonal Trends**: Xu hướng theo mùa

### Sử dụng Mock Data

Mock data sẽ được sử dụng tự động khi:
1. API calls fail
2. Backend chưa sẵn sàng
3. Testing và development

### Test Component

File `MockDataTest.jsx` cung cấp component để test và xem tất cả mock data có sẵn.

## Cách hoạt động

### 1. API Backend có sẵn
- `/statistics/bookings` - Thống kê booking theo thời gian

### 2. Tính toán thống kê từ dữ liệu có sẵn
Frontend sẽ gọi các API sau để tính toán thống kê:

- **Booking Statistics**: Sử dụng `/statistics/bookings` từ backend
- **Revenue Statistics**: Tính từ dữ liệu booking (tổng doanh thu, đã thanh toán, chưa thanh toán)
- **Customer Statistics**: Tính từ dữ liệu booking và customers
- **Room Statistics**: Lấy từ `/rooms/list`
- **Request Statistics**: Lấy từ `/bookings/bookingChangeRequests`

### 3. Các hàm chính

#### `getBookingStatistics(token, filters)`
- Gọi API `/statistics/bookings` từ backend
- Trả về thống kê booking theo ngày

#### `getRevenueStatistics(token, filters)`
- Lấy tất cả bookings
- Tính toán: tổng doanh thu, đã thanh toán, chưa thanh toán, trung bình

#### `getCustomerStatistics(token, filters)`
- Lấy bookings và customers
- Tính toán: khách hàng mới, khách hàng duy nhất, trung bình booking/khách

#### `getRoomStatistics(token)`
- Lấy tất cả rooms
- Tính toán: tổng phòng, sức chứa, loại phòng

#### `getComprehensiveStatistics(token, filters)`
- Tổng hợp tất cả thống kê
- Trả về object chứa booking, revenue, customer, room, requests

### 4. Real-time Statistics
- Tính toán dữ liệu thời gian thực từ các API có sẵn
- Booking hôm nay, doanh thu hôm nay, yêu cầu chờ xử lý

## Cấu trúc dữ liệu

### Booking Statistics
```javascript
{
  date: "2024-01-01",
  totalBookings: 15,
  confirmedBookings: 12,
  totalRevenue: 2500000
}
```

### Comprehensive Statistics
```javascript
{
  booking: {
    total: 1250,
    confirmed: 1100,
    cancelled: 150,
    confirmationRate: 88.0,
    cancellationRate: 12.0
  },
  revenue: {
    total: 450000000,
    paid: 380000000,
    unpaid: 70000000,
    averagePerBooking: 360000
  },
  customer: {
    newCustomers: 45
  },
  room: {
    total: 50,
    totalCapacity: 120
  },
  requests: {
    pending: 8
  }
}
```

## Lưu ý

1. **Fallback Data**: Nếu API fail, sẽ sử dụng mock data để đảm bảo UI hoạt động
2. **Error Handling**: Tất cả API calls đều có try-catch để xử lý lỗi gracefully
3. **Performance**: Sử dụng Promise.all để gọi nhiều API song song
4. **Caching**: Có thể implement caching để tối ưu performance

## Tương lai

Khi backend có thêm các API statistics, có thể dễ dàng chuyển sang sử dụng API thực thay vì tính toán từ dữ liệu có sẵn. 