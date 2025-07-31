# Date Utils

Các utility functions để format date thống nhất trong ứng dụng.

## Các functions có sẵn

### `formatDate(date)`
Format date thành định dạng `dd/mm/yyyy`

**Parameters:**
- `date`: string | Date - Ngày cần format

**Returns:**
- `string`: Ngày đã format theo định dạng dd/mm/yyyy hoặc '-' nếu không hợp lệ

**Example:**
```javascript
import { formatDate } from '../../utils/dateUtils';

formatDate('2024-01-15'); // Returns: "15/01/2024"
formatDate(new Date()); // Returns: "25/12/2024"
formatDate(null); // Returns: "-"
```

### `formatDateTime(date)`
Format date và time thành định dạng `dd/mm/yyyy HH:mm`

**Parameters:**
- `date`: string | Date - Ngày và giờ cần format

**Returns:**
- `string`: Ngày và giờ đã format theo định dạng dd/mm/yyyy HH:mm hoặc '-' nếu không hợp lệ

**Example:**
```javascript
import { formatDateTime } from '../../utils/dateUtils';

formatDateTime('2024-01-15T10:30:00Z'); // Returns: "15/01/2024 10:30"
formatDateTime(new Date()); // Returns: "25/12/2024 14:30"
```

### `formatDateForInput(date)`
Format date cho input type="date" (định dạng yyyy-mm-dd)

**Parameters:**
- `date`: string | Date - Ngày cần format

**Returns:**
- `string`: Ngày đã format theo định dạng yyyy-mm-dd hoặc chuỗi rỗng nếu không hợp lệ

**Example:**
```javascript
import { formatDateForInput } from '../../utils/dateUtils';

formatDateForInput('2024-01-15'); // Returns: "2024-01-15"
formatDateForInput(new Date()); // Returns: "2024-12-25"
```

### `getCurrentDate()`
Lấy ngày hiện tại theo định dạng dd/mm/yyyy

**Returns:**
- `string`: Ngày hiện tại theo định dạng dd/mm/yyyy

**Example:**
```javascript
import { getCurrentDate } from '../../utils/dateUtils';

getCurrentDate(); // Returns: "25/12/2024"
```

### `getCurrentDateTime()`
Lấy ngày và giờ hiện tại theo định dạng dd/mm/yyyy HH:mm

**Returns:**
- `string`: Ngày và giờ hiện tại theo định dạng dd/mm/yyyy HH:mm

**Example:**
```javascript
import { getCurrentDateTime } from '../../utils/dateUtils';

getCurrentDateTime(); // Returns: "25/12/2024 14:30"
```

## Cách sử dụng

1. Import function cần thiết:
```javascript
import { formatDate, formatDateTime, getCurrentDate } from '../../utils/dateUtils';
```

2. Sử dụng trong component:
```javascript
const MyComponent = ({ booking }) => {
  return (
    <div>
      <p>Check-in: {formatDate(booking.checkInDate)}</p>
      <p>Ngày tạo: {formatDateTime(booking.createdAt)}</p>
      <p>Hôm nay: {getCurrentDate()}</p>
    </div>
  );
};
```

## Lưu ý

- Tất cả các functions đều xử lý trường hợp date không hợp lệ và trả về '-' hoặc chuỗi rỗng
- Định dạng thống nhất là dd/mm/yyyy cho hiển thị ngày
- Định dạng dd/mm/yyyy HH:mm cho hiển thị ngày và giờ
- Định dạng yyyy-mm-dd cho input type="date" 