import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import BookingList from './components/BookingList/BookingList';
import AddBookingModal from './components/AddBookingModal/AddBookingModal';
import UpdateBookingModal from './components/UpdateBookingModal/UpdateBookingModal';
import DeleteBookingModal from './components/DeleteBookingModal/DeleteBookingModal';
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal';

import { UserContext } from '../../context/UserContext';
import { getBookings } from './BookingAPI';
import styles from './BookingListPage.module.scss';
import { 
  FaPlusCircle, 
  FaFilter, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaClock, 
  FaSearch, 
  FaDownload, 
  FaChartBar,
  FaExchangeAlt,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { 
  MdOutlineEventAvailable, 
  MdOutlineSchedule, 
  MdOutlineCheckCircle, 
  MdOutlineCancel, 
  MdOutlineAttachMoney, 
  MdOutlineToday 
} from 'react-icons/md';
import BookingFilterModal from './components/BookingFilterModal/BookingFilterModal';
import BookingFilterBar from './components/BookingFilterBar/BookingFilterBar';
import { 
  ExportDataModal, 
  LoadingSpinner, 
  StatusBadge, 
  StatCard
} from '../../components';

const BookingListPage = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageRevenue: 0,
    todayBookings: 0,
    thisMonthBookings: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestChange, setShowRequestChange] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch bookings and calculate stats
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const data = await getBookings(token);
        setBookings(data);
        
        // Calculate statistics
        const totalBookings = data.length;
        const pendingBookings = data.filter(b => b.status === 'Pending').length;
        const confirmedBookings = data.filter(b => b.status === 'Confirmed').length;
        const cancelledBookings = data.filter(b => b.status === 'Cancelled').length;
        const totalRevenue = data.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const averageRevenue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
        
        const today = new Date().toDateString();
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        
        const todayBookings = data.filter(b => {
          const bookingDate = new Date(b.createdAt || b.updatedAt).toDateString();
          return bookingDate === today;
        }).length;
        
        const thisMonthBookings = data.filter(b => {
          const bookingDate = new Date(b.createdAt || b.updatedAt);
          return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear;
        }).length;
        
        setStats({
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          totalRevenue,
          averageRevenue,
          todayBookings,
          thisMonthBookings
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, reload]);

  const handleReload = () => setReload(r => !r);

  // Xuất dữ liệu booking
  const handleExportData = () => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const exportData = bookings.map(booking => ({
        'Mã booking': booking.bookingId || booking._id,
        'Khách hàng': booking.customerId && typeof booking.customerId === 'object' ? booking.customerId.fullName : String(booking.customerId),
        'Phòng': (() => {
          if (booking.room && typeof booking.room === 'object') {
            return booking.room.roomNumber || 'N/A';
          } else if (booking.roomId && typeof booking.roomId === 'object') {
            return booking.roomId.roomNumber || 'N/A';
          } else if (booking.room) {
            return String(booking.room);
          } else if (booking.roomId) {
            return String(booking.roomId);
          } else {
            return 'N/A';
          }
        })(),
        'Ngày check-in': booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A',
        'Ngày check-out': booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A',
        'Trạng thái': getStatusBadge(booking.status).props.children,
        'Thanh toán': getPaymentBadge(booking.paymentStatus).props.children,
        'Tổng tiền (VNĐ)': booking.totalPrice?.toLocaleString('vi-VN') || 'N/A',
        'Ngày tạo': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : 'N/A',
        'Ngày cập nhật': booking.updatedAt ? new Date(booking.updatedAt).toLocaleDateString('vi-VN') : 'N/A'
      }));

      // Tạo CSV content
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes in CSV
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      // Tạo và download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `danh_sach_booking_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hiển thị thông báo thành công
      console.log('Xuất dữ liệu booking thành công!');
    } catch (error) {
      console.error('Error exporting booking data:', error);
    }
  };

  const handleMarkPaid = (booking) => {
    // Thực hiện logic đánh dấu đã thanh toán ở đây
    alert('Đã đánh dấu thanh toán cho booking: ' + booking._id);
  };

  // Booking columns for export
  const bookingColumns = [
    { key: '_id', header: 'Mã booking', accessor: '_id' },
    { key: 'customerName', header: 'Khách hàng', accessor: 'customerName' },
    { key: 'roomNumber', header: 'Phòng', accessor: 'roomNumber' },
    { key: 'checkInDate', header: 'Ngày check-in', accessor: 'checkInDate' },
    { key: 'checkOutDate', header: 'Ngày check-out', accessor: 'checkOutDate' },
    { key: 'totalPrice', header: 'Tổng tiền', accessor: 'totalPrice' },
    { key: 'status', header: 'Trạng thái', accessor: 'status' },
    { key: 'paymentStatus', header: 'Thanh toán', accessor: 'paymentStatus' },
    { key: 'createdAt', header: 'Ngày tạo', accessor: 'createdAt' }
  ];

  // Custom export function for bookings
  const handleCustomExport = async (exportConfig) => {
    const { data, columns, format } = exportConfig;
    
    // Transform data for export
    const exportData = data.map(booking => {
      const transformed = {};
      columns.forEach(colKey => {
        let value = booking[colKey];
        
        // Format specific fields
        if (colKey === 'checkInDate' || colKey === 'checkOutDate') {
          value = new Date(value).toLocaleDateString('vi-VN');
        } else if (colKey === 'totalPrice') {
          value = (value || 0).toLocaleString();
        } else if (colKey === 'createdAt') {
          value = new Date(value).toLocaleDateString('vi-VN');
        }
        
        transformed[colKey] = value || '';
      });
      return transformed;
    });

    // Use the export config data
    exportConfig.data = exportData;
    
    // Call default export
    if (format === 'csv') {
      exportToCSV(exportConfig);
    } else if (format === 'excel') {
      exportToExcel(exportConfig);
    }
  };

  // Export to CSV
  const exportToCSV = (exportConfig) => {
    const { data, columns, fileName } = exportConfig;
    const headers = columns.map(col => col);
    const csvContent = [
      headers,
      ...data.map(row => columns.map(col => row[col] || ''))
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const exportToExcel = async (exportConfig) => {
    try {
      const XLSX = await import('xlsx');
      const { saveAs } = await import('file-saver');
      const { data, columns, fileName } = exportConfig;
      
      const exportData = data.map(row => {
        const obj = {};
        columns.forEach(col => {
          obj[col] = row[col] || '';
        });
        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Không thể xuất file Excel. Vui lòng thử xuất CSV!');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return <StatusBadge status={status} type="booking" showIcon />;
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    return <StatusBadge status={status} type="payment" showIcon />;
  };

  return (
    <Container className={styles.bookingPageContainer}>
      {/* Header */}
      <div className={styles.bookingHeader}>
        <div>
          <h2 className={styles.bookingTitle}>Quản lý đặt phòng</h2>
          <p className={styles.bookingSubtitle}>Quản lý thông tin và trạng thái các đặt phòng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className={styles.statsRow}>
        <Col md={3}>
          <StatCard
            title="Tổng booking"
            value={stats.total}
            icon={<MdOutlineEventAvailable size={18} />}
            color="#00AEEF"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Chờ xác nhận"
            value={stats.pending}
            icon={<MdOutlineSchedule size={18} />}
            color="#ffc107"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Đã xác nhận"
            value={stats.confirmed}
            icon={<MdOutlineCheckCircle size={18} />}
            color="#28a745"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Giá TB"
            value={`${stats.averageRevenue.toLocaleString()} ₫`}
            icon={<MdOutlineAttachMoney size={18} />}
            color="#17a2b8"
            size="lg"
          />
        </Col>
      </Row>

      {/* Booking Filter Bar */}
      <BookingFilterBar 
        search={searchTerm}
        setSearch={setSearchTerm}
        onAddBooking={() => setShowAdd(true)}
        onFilter={() => setShowFilter(true)}
        onExport={handleExportData}
        onReload={handleReload}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Booking List */}
      <BookingList
        token={token}
        reload={reload}
        filter={{ ...filter, search: searchTerm }}
        onEdit={booking => { setSelectedBooking(booking); setShowUpdate(true); }}
        onDelete={booking => { setSelectedBooking(booking); setShowDelete(true); }}
        onDetail={booking => { setSelectedBooking(booking); setShowDetail(true); }}
        onRequestChange={booking => { setShowRequestChange(true); }}
        onMarkPaid={handleMarkPaid}
      />

      {/* Modals */}
      <BookingFilterModal 
        show={showFilter} 
        onClose={() => setShowFilter(false)} 
        filter={filter} 
        setFilter={setFilter} 
      />
      <ExportDataModal
        show={showExport}
        onHide={() => setShowExport(false)}
                 data={bookings.map(b => ({
           ...b,
           customerName: b.customerId && typeof b.customerId === 'object' ? b.customerId.fullName : String(b.customerId),
           roomNumber: (() => {
             if (b.room && typeof b.room === 'object') {
               return b.room.roomNumber || 'N/A';
             } else if (b.roomId && typeof b.roomId === 'object') {
               return b.roomId.roomNumber || 'N/A';
             } else if (b.room) {
               return String(b.room);
             } else if (b.roomId) {
               return String(b.roomId);
             } else {
               return 'N/A';
             }
           })(),
         }))}
        columns={bookingColumns}
        defaultFileName="bookings"
        title="Xuất dữ liệu đặt phòng"
        onExport={handleCustomExport}
      />
      <AddBookingModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        token={token}
        onAdded={handleReload}
      />
      <UpdateBookingModal
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        booking={selectedBooking}
        token={token}
        onUpdated={handleReload}
      />
      <DeleteBookingModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        booking={selectedBooking}
        token={token}
        onDeleted={handleReload}
      />
      <BookingDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        booking={selectedBooking}
      />
      
                        {/* Loading Spinner */}
                  {loading && (
                    <LoadingSpinner 
                      overlay 
                      text="Đang tải dữ liệu booking..." 
                    />
                  )}
    </Container>
  );
};

export default BookingListPage; 