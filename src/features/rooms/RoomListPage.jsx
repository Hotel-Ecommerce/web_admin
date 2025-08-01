import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { FaBed, FaUsers, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import CustomButton from '../../components/Button/CustomButton';
import AddRoomModal from './components/AddRoom/AddRoomModal';
import { queryRooms, deleteRoom, getRoomById } from './RoomAPI';
import RoomFilterBar from './components/RoomFilterBar/RoomFilterBar';
import RoomTable from './components/RoomTable/RoomTable';
import styles from './RoomListPage.module.scss';
import UpdateRoomModal from './components/UpdateRoom/UpdateRoomModal';
import RoomDetailModal from './components/RoomDetailModal/RoomDetailModal';
import RoomFilterModal from './components/RoomFilterModal/RoomFilterModal';
import DeleteRoomModal from './components/DeleteRoom/DeleteRoomModal';
import { StatCard } from '../../components';

const RoomListPage = () => {
  console.log('RoomListPage component is rendering');
  
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeFilters, setActiveFilters] = useState(() => {
    const savedFilters = localStorage.getItem('roomFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      type: 'all',
      status: 'all',
      priceRange: 'all',
      capacity: 'all',
      sortBy: 'roomNumber'
    };
  });
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    totalRevenue: 0
  });

  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  
  // Warning state for delete functionality
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  

  // Fetch room list from backend
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await queryRooms();
        
        // Debug: Kiểm tra dữ liệu thời gian
        console.log('Room data sample:', data.slice(0, 2).map(room => ({
          roomNumber: room.roomNumber,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          hasCreatedAt: !!room.createdAt,
          hasUpdatedAt: !!room.updatedAt
        })));
        
        setRooms(data);
        
        // Tính toán thống kê
        const availableRooms = data.filter(r => getRoomStatus(r) === 'available');
        const totalRevenue = data.reduce((sum, room) => sum + (room.price || 0), 0);
        
        setStats({
          total: data.length,
          available: availableRooms.length,
          occupied: data.filter(r => getRoomStatus(r) === 'occupied').length,
          totalRevenue: totalRevenue
        });
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Hàm tính toán trạng thái phòng dựa trên bookedTime
  const getRoomStatus = (room) => {
    if (!room.bookedTime || room.bookedTime.length === 0) {
      return 'available';
    }
    
    const now = new Date();
    const currentBookings = room.bookedTime.filter(booking => {
      const start = new Date(booking.start);
      const end = new Date(booking.end);
      return now >= start && now <= end;
    });
    
    return currentBookings.length > 0 ? 'occupied' : 'available';
  };

  // Advanced filtering function
  const applyAdvancedFilters = (rooms, filters) => {
    let filteredRooms = [...rooms];

    // Filter theo loại phòng
    if (filters.type && filters.type !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.type === filters.type);
    }

    // Filter theo trạng thái
    if (filters.status && filters.status !== 'all') {
      filteredRooms = filteredRooms.filter(room => getRoomStatus(room) === filters.status);
    }

    // Filter theo khoảng giá
    if (filters.priceRange && filters.priceRange !== 'all') {
      filteredRooms = filteredRooms.filter(room => {
        const price = room.price;
        switch (filters.priceRange) {
          case 'low':
            return price < 500000;
          case 'medium':
            return price >= 500000 && price <= 1000000;
          case 'high':
            return price > 1000000;
          default:
            return true;
        }
      });
    }

    // Filter theo sức chứa
    if (filters.capacity && filters.capacity !== 'all') {
      filteredRooms = filteredRooms.filter(room => {
        const capacity = room.capacity;
        return capacity === parseInt(filters.capacity);
      });
    }



    // Sort
    if (filters.sortBy && filters.sortBy !== 'roomNumber') {
      filteredRooms.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'capacity_asc':
            return a.capacity - b.capacity;
          case 'capacity_desc':
            return b.capacity - a.capacity;
          case 'createdAt_asc':
            return (new Date(a.createdAt || 0)).getTime() - (new Date(b.createdAt || 0)).getTime();
          case 'createdAt_desc':
            return (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime();
          case 'updatedAt_asc':
            return (new Date(a.updatedAt || 0)).getTime() - (new Date(b.updatedAt || 0)).getTime();
          case 'updatedAt_desc':
            return (new Date(b.updatedAt || 0)).getTime() - (new Date(a.updatedAt || 0)).getTime();
          default:
            return 0;
        }
      });
    } else {
      // Mặc định sort theo số phòng
      filteredRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
    }

    return filteredRooms;
  };

  // Filter rooms by search and advanced filters
  useEffect(() => {
    let filteredData = rooms;

    // Áp dụng search
    if (search) {
      const lower = search.toLowerCase();
      filteredData = filteredData.filter(r =>
          (r.roomNumber && r.roomNumber.toLowerCase().includes(lower)) ||
          (r.type && r.type.toLowerCase().includes(lower)) ||
          (r.description && r.description.toLowerCase().includes(lower))
      );
    }

    // Áp dụng advanced filters
    filteredData = applyAdvancedFilters(filteredData, activeFilters);
    
    setFilteredRooms(filteredData);
    
    // Cập nhật thống kê từ dữ liệu đã filter
    const availableRooms = filteredData.filter(r => getRoomStatus(r) === 'available');
    const totalRevenue = filteredData.reduce((sum, room) => sum + (room.price || 0), 0);
    
    setStats({
      total: filteredData.length,
      available: availableRooms.length,
      occupied: filteredData.filter(r => getRoomStatus(r) === 'occupied').length,
      totalRevenue: totalRevenue
    });
  }, [search, rooms, activeFilters]);

  // Apply filters
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    localStorage.setItem('roomFilters', JSON.stringify(filters));
    console.log('Applying room filters:', filters);
    

  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      type: 'all',
      status: 'all',
      priceRange: 'all',
      capacity: 'all',
      sortBy: 'roomNumber'
    };
    setActiveFilters(resetFilters);
    localStorage.removeItem('roomFilters');
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => value !== 'all' && value !== '').length;
  };

  // Toast notification functions
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  // Xuất dữ liệu phòng
  const handleExportData = () => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const exportData = filteredRooms.map(room => ({
        'Số phòng': room.roomNumber,
        'Loại phòng': getTypeName(room.type),
        'Giá (VNĐ)': room.price?.toLocaleString('vi-VN') || 'N/A',
        'Sức chứa': `${room.capacity} người`,
        'Trạng thái': getRoomStatus(room) === 'available' ? 'Trống' : 'Đã thuê',
        'Mô tả': room.description || 'Không có mô tả',
        'Số lượng booking': room.bookedTime?.length || 0,
        'Ngày tạo': room.createdAt ? new Date(room.createdAt).toLocaleDateString('vi-VN') : 'N/A',
        'Ngày cập nhật': room.updatedAt ? new Date(room.updatedAt).toLocaleDateString('vi-VN') : 'N/A'
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
      link.setAttribute('download', `danh_sach_phong_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToastNotification('Xuất dữ liệu thành công!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToastNotification('Có lỗi xảy ra khi xuất dữ liệu!', 'error');
    }
  };

  // Helper function để lấy tên loại phòng
  const getTypeName = (type) => {
    switch (type) {
      case 'Standard': return 'Tiêu chuẩn';
      case 'Deluxe': return 'Cao cấp';
      case 'Suite': return 'Hạng sang';
      default: return type;
    }
  };

  // Xoá phòng khỏi backend và cập nhật danh sách
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteRoom(id);
      setRooms(prev => prev.filter(r => r._id !== id));
      setShowDelete(false);
      setSelectedRoom(null);
      
      // Cập nhật stats sau khi xóa
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      showToastNotification('Xóa phòng thành công!', 'success');
    } catch (err) {
      console.error('Error deleting room:', err);
      
      // Xử lý lỗi cụ thể
      let errorMessage = 'Có lỗi xảy ra khi xoá phòng.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 501) {
        errorMessage = 'Chức năng xóa phòng chưa được triển khai trên server.';
        setShowDeleteWarning(true); // Hiển thị cảnh báo
      }
      
      showToastNotification(errorMessage, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Xem chi tiết phòng
  const handleViewDetail = async (id) => {
    setLoading(true);
    try {
      const room = await getRoomById(id);
      setSelectedRoom(room);
      setShowDetail(true);
    } catch (err) {
      showToastNotification('Không thể lấy thông tin phòng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột cho bảng phòng
  const columns = [
    { 
      header: 'STT', 
      accessor: 'index',
      cell: (row) => (
        <div style={{ 
          fontWeight: '600',
          color: '#4A5568',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          {row._paginationIndex ? row._paginationIndex + 1 : 1}
        </div>
      )
    },
    { 
      header: 'Số phòng', 
      accessor: 'roomNumber',
      cell: (row) => (
        <div style={{ 
          fontWeight: 'bold', 
          color: '#1A202C',
          fontSize: '1.1rem'
        }}>
          {row.roomNumber}
        </div>
      )
    },
    { 
      header: 'Loại phòng', 
      accessor: 'type',
      cell: (row) => {
        const getTypeColor = (type) => {
          switch (type) {
            case 'Standard': return '#45B7D1';
            case 'Deluxe': return '#4ECDC4';
            case 'Suite': return '#FF6B6B';
            default: return '#6c757d';
          }
        };



        return (
          <div style={{ 
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '500',
            display: 'inline-block',
            background: getTypeColor(row.type),
            color: 'white'
          }}>
            {getTypeName(row.type)}
          </div>
        );
      }
    },
    { 
      header: 'Giá (VNĐ)', 
      accessor: 'price',
      cell: (row) => (
        <div style={{ 
          fontWeight: '600',
          color: '#2D3748'
        }}>
          {new Intl.NumberFormat('vi-VN').format(row.price)} ₫
        </div>
      )
    },
    { 
      header: 'Sức chứa', 
      accessor: 'capacity',
      cell: (row) => (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <span style={{ fontWeight: '500' }}>{row.capacity} người</span>
        </div>
      )
    },
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            style={{
              background: '#00AEEF', 
              border: 'none', 
              color: '#fff',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.85rem'
            }} 
            size="sm" 
            onClick={() => handleViewDetail(row._id)}
            onMouseOver={e => e.currentTarget.style.background = '#0095c8'}
            onMouseOut={e => e.currentTarget.style.background = '#00AEEF'}
          >
            👁 Xem
          </Button>
          <Button 
            style={{
              background: '#ffc107', 
              border: 'none', 
              color: '#1C1C1E',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.85rem'
            }} 
            size="sm" 
            onClick={() => { setSelectedRoom(row); setShowUpdate(true); }}
            onMouseOver={e => e.currentTarget.style.background = '#e0a800'}
            onMouseOut={e => e.currentTarget.style.background = '#ffc107'}
          >
            ✏ Sửa
          </Button>
          <Button 
            style={{
              background: '#dc3545', 
              border: 'none', 
              color: '#fff',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.85rem'
            }} 
            size="sm" 
            onClick={() => { setSelectedRoom(row); setShowDelete(true); }}
            onMouseOver={e => e.currentTarget.style.background = '#c82333'}
            onMouseOut={e => e.currentTarget.style.background = '#dc3545'}
          >
            🗑 Xóa
          </Button>
        </div>
      )
    }
  ];

  return (
    <Container className={styles.roomPageContainer}>
      <div className={styles.roomHeader}>
        <h2 className={styles.roomTitle}>Danh sách phòng</h2>
        <p className={styles.roomSubtitle}>Quản lý thông tin và trạng thái các phòng</p>
      </div>

      {/* Warning Alert for Delete Functionality */}
      {showDeleteWarning && (
        <div style={{
          background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong>⚠️ Cảnh báo:</strong> Chức năng xóa phòng hiện tại không khả dụng do lỗi server. 
            Vui lòng liên hệ quản trị viên để được hỗ trợ.
          </div>
        <Button
            variant="outline-light" 
            size="sm"
            onClick={() => setShowDeleteWarning(false)}
          >
            ✕
        </Button>
      </div>
      )}



      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <StatCard
            title="Tổng phòng"
            value={stats.total}
            icon={<FaBed size={18} />}
            color="#667eea"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Phòng trống"
            value={stats.available}
            icon={<FaCheckCircle size={18} />}
            color="#48BB78"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Đã thuê"
            value={stats.occupied}
            icon={<FaTimesCircle size={18} />}
            color="#F56565"
            size="lg"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Tổng giá trị"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon={<FaMoneyBillWave size={18} />}
            color="#9F7AEA"
            size="lg"
          />
        </Col>
      </Row>

      <RoomFilterBar 
        search={search} 
        setSearch={setSearch} 
        onAddRoom={() => setShowModal(true)}
        onFilter={() => setShowFilter(true)}
        onExport={handleExportData}
        activeFiltersCount={getActiveFiltersCount()}
      />
      <RoomTable columns={columns} data={filteredRooms} loading={loading} />
      <AddRoomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        setRooms={setRooms}
          onSuccess={(message) => showToastNotification(message, 'success')}
          onError={(message) => showToastNotification(message, 'error')}
      />
      <UpdateRoomModal
        show={showUpdate}
        onHide={() => setShowUpdate(false)}
        room={selectedRoom}
        setRooms={setRooms}
        onSuccess={(message) => showToastNotification(message, 'success')}
        onError={(message) => showToastNotification(message, 'error')}
      />
      <RoomDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        room={selectedRoom}
      />
      
      {/* Delete Room Modal */}
      <DeleteRoomModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        room={selectedRoom}
        onDelete={handleDelete}
        loading={deleting}
      />
      
      {/* Filter Modal */}
      <RoomFilterModal
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        currentFilters={activeFilters}
      />
      

      
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={hideToast} 
          delay={3000} 
          autohide
          bg={toastType === 'success' ? 'success' : 'danger'}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Thành công' : '❌ Lỗi'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === 'success' ? 'text-white' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default RoomListPage;