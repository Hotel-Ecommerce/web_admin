# 🧩 Common Components Library

Thư viện các component chung được sử dụng trong toàn bộ ứng dụng.

## 📦 Installation

```javascript
// Import tất cả components
import { 
  Button, 
  LoadingSpinner, 
  StatusBadge, 
  StatCard, 
  SearchBox,
  ExportDataModal 
} from '../components';

// Hoặc import từng component riêng lẻ
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
```

## 🎯 Components

### 1. 🔄 LoadingSpinner

Component hiển thị trạng thái loading với nhiều tùy chọn.

```jsx
import { LoadingSpinner } from '../components';

// Basic usage
<LoadingSpinner />

// With custom text
<LoadingSpinner text="Đang tải dữ liệu..." />

// Full screen overlay
<LoadingSpinner fullScreen text="Đang xử lý..." />

// Overlay on container
<LoadingSpinner overlay text="Đang lưu..." />

// Custom size and variant
<LoadingSpinner 
  size="grow" 
  variant="success" 
  text="Thành công!"
/>
```

**Props:**
- `size`: 'border' | 'grow' (default: 'border')
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' (default: 'primary')
- `text`: string (default: 'Đang tải...')
- `fullScreen`: boolean (default: false)
- `overlay`: boolean (default: false)
- `className`: string

### 2. 🏷️ StatusBadge

Component hiển thị badge trạng thái với nhiều loại khác nhau.

```jsx
import { StatusBadge } from '../components';

// Booking status
<StatusBadge status="Pending" type="booking" showIcon />

// Payment status
<StatusBadge status="Paid" type="payment" size="lg" />

// Room status
<StatusBadge status="available" type="room" />

// Custom status
<StatusBadge status="Active" bg="success" text="Hoạt động" />
```

**Props:**
- `status`: string - Trạng thái cần hiển thị
- `type`: 'booking' | 'payment' | 'room' | 'customer' | 'employee' | 'request' (default: 'status')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `showIcon`: boolean (default: false)
- `className`: string

**Supported Status Types:**
- **Booking**: Pending, Confirmed, Cancelled, Completed
- **Payment**: Paid, Unpaid, Partial
- **Room**: available, occupied, maintenance, reserved
- **Customer**: active, inactive
- **Employee**: active, inactive
- **Request**: Pending, Approved, Disapproved

### 3. 📊 StatCard

Component hiển thị thống kê dạng card với icon và trend.

```jsx
import { StatCard } from '../components';

// Basic stat card
<StatCard 
  title="Tổng booking"
  value={150}
  icon="📅"
  color="#00AEEF"
/>

// With trend
<StatCard 
  title="Doanh thu"
  value={25000000}
  icon="💰"
  color="#28a745"
  trend
  trendValue={12.5}
  trendDirection="up"
/>

// Clickable card
<StatCard 
  title="Phòng trống"
  value={25}
  icon="🛏️"
  color="#ffc107"
  onClick={() => navigate('/rooms')}
/>
```

**Props:**
- `title`: string - Tiêu đề thống kê
- `value`: number | string - Giá trị
- `icon`: string | ReactNode - Icon hiển thị
- `color`: string - Màu nền icon (default: '#00AEEF')
- `trend`: boolean - Hiển thị trend (default: false)
- `trendValue`: number - Giá trị trend (%)
- `trendDirection`: 'up' | 'down' | 'neutral' (default: 'up')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `onClick`: function - Callback khi click
- `className`: string

### 4. 🔍 SearchBox

Component tìm kiếm với debounce và clear button.

```jsx
import { SearchBox } from '../components';

// Basic search
<SearchBox 
  placeholder="Tìm kiếm khách hàng..."
  onChange={setSearchTerm}
/>

// With debounced search
<SearchBox 
  placeholder="Tìm kiếm booking..."
  onSearch={handleSearch}
  debounceMs={500}
/>

// Custom variant and size
<SearchBox 
  placeholder="Tìm kiếm phòng..."
  variant="outlined"
  size="lg"
  onChange={setSearchTerm}
  onClear={handleClear}
/>
```

**Props:**
- `placeholder`: string (default: 'Tìm kiếm...')
- `value`: string - Giá trị hiện tại
- `onChange`: function - Callback khi thay đổi giá trị
- `onClear`: function - Callback khi clear
- `onSearch`: function - Callback khi search (với debounce)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'default' | 'outlined' | 'filled' (default: 'default')
- `disabled`: boolean (default: false)
- `debounceMs`: number - Thời gian debounce (default: 300)
- `showClearButton`: boolean (default: true)
- `icon`: ReactNode - Icon tìm kiếm (default: FaSearch)
- `className`: string

### 5. 📤 ExportDataModal

Component modal xuất dữ liệu với nhiều định dạng.

```jsx
import { ExportDataModal } from '../components';

// Basic export
<ExportDataModal
  show={showExport}
  onHide={() => setShowExport(false)}
  data={bookings}
  columns={bookingColumns}
  defaultFileName="bookings"
  title="Xuất dữ liệu đặt phòng"
/>

// With custom export function
<ExportDataModal
  show={showExport}
  onHide={() => setShowExport(false)}
  data={customers}
  columns={customerColumns}
  defaultFileName="customers"
  title="Xuất dữ liệu khách hàng"
  onExport={handleCustomExport}
  showDateRange
/>
```

**Props:**
- `show`: boolean - Hiển thị modal
- `onHide`: function - Callback khi đóng modal
- `data`: array - Dữ liệu cần xuất
- `columns`: array - Cấu hình cột
- `defaultFileName`: string - Tên file mặc định
- `title`: string - Tiêu đề modal (default: 'Xuất dữ liệu')
- `showColumnSelection`: boolean (default: true)
- `showFormatSelection`: boolean (default: true)
- `showDateRange`: boolean (default: false)
- `onExport`: function - Custom export function

### 6. 🎨 Button

Component button tùy chỉnh.

```jsx
import { Button } from '../components';

// Basic button
<Button variant="primary" onClick={handleClick}>
  Thêm mới
</Button>

// Custom styled button
<Button 
  variant="success" 
  size="lg"
  className="custom-button"
  onClick={handleSave}
>
  Lưu thay đổi
</Button>
```

### 7. 📋 TableWrapper

Component wrapper cho table.

```jsx
import { TableWrapper } from '../components';

const columns = [
  { header: 'Tên', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { 
    header: 'Hành động', 
    accessor: 'actions',
    cell: (row) => <button onClick={() => edit(row)}>Sửa</button>
  }
];

<TableWrapper columns={columns} data={users} />
```

## 🎨 Styling

Tất cả components đều sử dụng CSS Modules và có responsive design. Có thể tùy chỉnh style bằng cách:

1. **Override CSS classes:**
```scss
// Trong file SCSS của bạn
.customButton {
  @extend .button;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}
```

2. **Inline styles:**
```jsx
<StatCard 
  style={{ 
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white' 
  }}
  title="Custom Card"
  value={100}
  icon="⭐"
/>
```

3. **CSS Variables:**
```css
:root {
  --primary-color: #00AEEF;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
}
```

## 📱 Responsive

Tất cả components đều responsive và hoạt động tốt trên:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Customization

### Tạo component mới

```jsx
// components/CustomComponent/CustomComponent.jsx
import React from 'react';
import styles from './CustomComponent.module.scss';

const CustomComponent = ({ children, ...props }) => {
  return (
    <div className={styles.container} {...props}>
      {children}
    </div>
  );
};

export default CustomComponent;
```

### Thêm vào index.js

```javascript
// components/index.js
export { default as CustomComponent } from './CustomComponent/CustomComponent';
```

## 🚀 Best Practices

1. **Import từ index:** Luôn import từ file index thay vì từng file riêng lẻ
2. **Props validation:** Sử dụng PropTypes hoặc TypeScript để validate props
3. **Accessibility:** Đảm bảo components có thể sử dụng với keyboard và screen reader
4. **Performance:** Sử dụng React.memo cho components không cần re-render thường xuyên
5. **Testing:** Viết test cho tất cả components

## 📚 Examples

Xem thêm examples trong các file:
- `BookingListPage.jsx` - Sử dụng ExportDataModal, LoadingSpinner
- `CustomerListPage.jsx` - Sử dụng SearchBox, StatusBadge
- `RoomListPage.jsx` - Sử dụng StatCard, TableWrapper
- `Dashboard.jsx` - Sử dụng SummaryStats, StatCard 