// src/features/customers/CustomerListPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Pagination, Card, Toast, ToastContainer } from 'react-bootstrap';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import { queryCustomers, getCustomerById, updateCustomer, deleteCustomer, addCustomer } from './CustomerAPI';
import CustomerDetailModal from './components/CustomerDetailModal/CustomerDetailModal';
import UpdateCustomerModal from './components/UpdateCustomerModal/UpdateCustomerModal';
import DeleteCustomerModal from './components/DeleteCustomerModal/DeleteCustomerModal';
import AddCustomerModal from './components/AddCustomerModal/AddCustomerModal';
import CustomerFilterModal from './components/CustomerFilterModal/CustomerFilterModal';
import { UserContext } from '../../context/UserContext';
import styles from './CustomerListPage.module.scss';
import { formatDate } from '../../utils/dateUtils';
import { FaUsers, FaUserPlus, FaSearch, FaFilter, FaDownload, FaChartBar } from 'react-icons/fa';
import { 
  ExportDataModal, 
  LoadingSpinner, 
  StatusBadge, 
  StatCard, 
  SearchBox 
} from '../../components';

const PAGE_SIZE = 20;

const CustomerListPage = () => {
  const { user } = useContext(UserContext);
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]); // Lưu tất cả dữ liệu để filter
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeFilters, setActiveFilters] = useState(() => {
    const savedFilters = localStorage.getItem('customerFilters');
    return savedFilters ? JSON.parse(savedFilters) : {};
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    withBookings: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch customer list from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Lấy tất cả dữ liệu từ API (không phân trang để có thể filter)
        const params = { size: 1000 }; // Lấy tất cả dữ liệu
        if (search) params.q = search;
        
        const data = await queryCustomers(params);
        const allData = data.customers || data;
        setAllCustomers(allData); // Lưu tất cả dữ liệu
        
        // Áp dụng advanced filtering
        let filteredData = applyAdvancedFilters(allData, activeFilters);
        
        // Phân trang sau khi filter
        const startIndex = page * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setCustomers(paginatedData);
        setTotalPages(Math.ceil(filteredData.length / PAGE_SIZE));
        
        // Tính toán thống kê từ dữ liệu đã filter
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        setStats({
          total: filteredData.length,
          active: filteredData.filter(c => c.status !== 'inactive').length,
          newThisMonth: filteredData.filter(c => {
            const createdDate = new Date(c.createdAt || c.updatedAt);
            return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
          }).length,
          withBookings: filteredData.filter(c => c.bookingCount > 0).length
        });
      } catch (err) {
        setCustomers([]);
        setAllCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [page, search, refresh, activeFilters]);

  // Xem chi tiết khách hàng
  const handleViewDetail = async (id) => {
    setLoading(true);
    try {
      const customer = await getCustomerById(id);
      setSelectedCustomer(customer);
      setShowDetail(true);
    } catch {
      setSelectedCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật khách hàng
  const handleUpdate = async (customer) => {
    setUpdating(true);
    try {
      await updateCustomer(customer);
      setShowUpdate(false);
      setRefresh(r => !r);
    } catch {
      // handle error
    } finally {
      setUpdating(false);
    }
  };

  // Xoá khách hàng
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteCustomer(id);
      setShowDelete(false);
      setRefresh(r => !r);
    } catch {
      // handle error
    } finally {
      setDeleting(false);
    }
  };

  // Thêm khách hàng
  const handleAdd = async (customer) => {
    setAdding(true);
    try {
      await addCustomer(customer);
      setShowAdd(false);
      setRefresh(r => !r);
      
      // Hiển thị thông báo thành công
      setToastMessage('Thêm khách hàng thành công!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      // Hiển thị thông báo lỗi
      setToastMessage(err?.response?.data?.message || 'Có lỗi xảy ra khi thêm khách hàng');
      setToastType('danger');
      setShowToast(true);
    } finally {
      setAdding(false);
    }
  };

  // Customer columns for export
  const customerColumns = [
    { key: 'fullName', header: 'Họ tên', accessor: 'fullName' },
    { key: 'email', header: 'Email', accessor: 'email' },
    { key: 'phone', header: 'Số điện thoại', accessor: 'phone' },
    { key: 'address', header: 'Địa chỉ', accessor: 'address' },
    { key: 'status', header: 'Trạng thái', accessor: 'status' },
    { key: 'createdAt', header: 'Ngày tạo', accessor: 'createdAt' },
    { key: 'bookingCount', header: 'Số booking', accessor: 'bookingCount' }
  ];

  // Custom export function for customers
  const handleCustomExport = async (exportConfig) => {
    const { data, columns, format } = exportConfig;
    
    // Transform data for export
    const exportData = data.map(customer => {
      const transformed = {};
      columns.forEach(colKey => {
        let value = customer[colKey];
        
        // Format specific fields
        if (colKey === 'createdAt') {
          value = formatDate(value || customer.updatedAt);
        } else if (colKey === 'bookingCount') {
          value = value || 0;
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
      XLSX.utils.book_append_sheet(wb, ws, 'Customers');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Không thể xuất file Excel. Vui lòng thử xuất CSV!');
    }
  };

  // Apply filters
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setPage(0);
    // Lưu filters vào localStorage chỉ khi áp dụng
    localStorage.setItem('customerFilters', JSON.stringify(filters));
    console.log('Applying filters:', filters);
  };

  // Advanced filtering function
  const applyAdvancedFilters = (customers, filters) => {
    let filteredCustomers = [...customers];

    // Filter theo khoảng thời gian tùy chỉnh
    if (filters.startDate || filters.endDate) {
      filteredCustomers = filteredCustomers.filter(customer => {
        const createdDate = new Date(customer.createdAt || customer.updatedAt);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;
        
        if (startDate && endDate) {
          return createdDate >= startDate && createdDate <= endDate;
        } else if (startDate) {
          return createdDate >= startDate;
        } else if (endDate) {
          return createdDate <= endDate;
        }
        return true;
      });
    }

    // Sort
    if (filters.sortBy && filters.sortBy !== 'createdAt') {
      filteredCustomers.sort((a, b) => {
        switch (filters.sortBy) {
          case 'createdAt_asc':
            return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt);
          case 'fullName':
            return a.fullName.localeCompare(b.fullName);
          case 'fullName_desc':
            return b.fullName.localeCompare(a.fullName);
          case 'email':
            return a.email.localeCompare(b.email);
          case 'email_desc':
            return b.email.localeCompare(a.email);
          default:
            return 0;
        }
      });
    } else {
      // Mặc định sort theo createdAt giảm dần
      filteredCustomers.sort((a, b) => 
        new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
      );
    }

    return filteredCustomers;
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(value => value !== 'all' && value !== '').length;
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {};
    setActiveFilters(resetFilters);
    localStorage.removeItem('customerFilters');
    setPage(0);
  };

  // Handle modal close without applying
  const handleFilterModalClose = () => {
    setShowFilter(false);
  };

  // Table columns
  const columns = [
    { 
      header: 'Họ tên', 
      accessor: 'fullName',
      cell: (row) => (
        <div style={{ textAlign: 'left' }}>
          <div style={{ 
            fontWeight: 'var(--font-semibold)', 
            color: '#1A202C',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-normal)'
          }}>{row.fullName}</div>
          {row.status === 'inactive' && <StatusBadge status="inactive" type="customer" size="sm" />}
        </div>
      )
    },
    { 
      header: 'Email', 
      accessor: 'email',
      cell: (row) => (
        <div style={{ textAlign: 'left' }}>
          <a 
            href={`mailto:${row.email}`}
            style={{ 
              color: '#00AEEF', 
              fontWeight: 'var(--font-medium)', 
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-bottom 0.2s ease',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-normal)'
            }}
            onMouseEnter={(e) => e.target.style.borderBottom = '1px solid #00AEEF'}
            onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
          >
            {row.email}
          </a>
        </div>
      )
    },
    { 
      header: 'Số điện thoại', 
      accessor: 'phone',
      cell: (row) => {
        // Format phone number
        const formatPhone = (phone) => {
          if (!phone) return '';
          const cleaned = phone.replace(/\D/g, '');
          if (cleaned.startsWith('84')) {
            return `+84 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
          } else if (cleaned.startsWith('0')) {
            return `+84 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
          }
          return phone;
        };
        
        return (
          <div style={{ 
            textAlign: 'left', 
            fontFamily: 'var(--font-family-mono)',
            fontWeight: 'var(--font-medium)',
            color: '#1A202C',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-normal)'
          }}>
            {formatPhone(row.phone)}
          </div>
        );
      }
    },
    {
      header: 'Thống kê',
      accessor: 'stats',
      cell: (row) => (
        <div style={{ 
          textAlign: 'left', 
          fontSize: 'var(--text-xs)', 
          color: '#718096',
          lineHeight: 'var(--leading-normal)'
        }}>
          <div>📅 {new Date(row.createdAt || row.updatedAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}</div>
          {row.bookingCount > 0 && (
            <div className="tabular-nums">📋 {row.bookingCount} booking</div>
          )}
        </div>
      )
    },
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <div style={{ textAlign: 'center' }}>
          <div className="dropdown">
            <Button 
              variant="outline-secondary" 
              size="sm"
              className="dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ 
                fontSize: '0.8rem',
                minWidth: '40px',
                padding: '0.375rem 0.5rem'
              }}
            >
              ⋯
            </Button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => handleViewDetail(row._id)}
                  style={{ fontSize: '0.85rem' }}
                >
                  👁 Xem chi tiết
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => { setSelectedCustomer(row); setShowUpdate(true); }}
                  style={{ fontSize: '0.85rem' }}
                >
                  ✏ Sửa thông tin
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger" 
                  onClick={() => { setSelectedCustomer(row); setShowDelete(true); }}
                  style={{ fontSize: '0.85rem' }}
                >
                  🗑 Xóa khách hàng
                </button>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Pagination items
  const paginationItems = [];
  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <Container className={styles.customerPageContainer}>
      {/* Header */}
      <div className={styles.customerHeader}>
        <div>
          <h2 className={styles.customerTitle}>Quản lý khách hàng</h2>
          <p className={styles.customerSubtitle}>Quản lý thông tin và tương tác với khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className={styles.statsRow}>
        <Col md={3}>
          <StatCard
            title="Tổng khách hàng"
            value={stats.total}
            icon={<FaUsers />}
            color="#00AEEF"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Mới tháng này"
            value={stats.newThisMonth}
            icon={<FaUserPlus />}
            color="#28a745"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Đang hoạt động"
            value={stats.active}
            icon={<FaChartBar />}
            color="#00AEEF"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Có booking"
            value={stats.withBookings}
            icon={<FaUsers />}
            color="#ffc107"
          />
        </Col>
      </Row>

      {/* Table with integrated controls */}
      <div className={styles.tableContainer}>
        {/* Table Header with Controls */}
        <div className={styles.tableHeader}>
          <div className={styles.tableControls}>
            <div className={styles.searchControl}>
              <SearchBox
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={search}
                onChange={(value) => { setSearch(value); setPage(0); }}
                onSearch={(value) => console.log('Search customers:', value)}
                debounceMs={500}
              />
            </div>
            <div className={styles.actionButtons}>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowFilter(true)}
                className={styles.filterButton}
                title="Lọc"
              >
                <FaFilter />
                {getActiveFiltersCount() > 0 && (
                  <span className={styles.filterBadge}>
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
              {getActiveFiltersCount() > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className={styles.resetFilterButton}
                  title="Xóa bộ lọc"
                >
                  🗑
                </Button>
              )}
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setRefresh(r => !r)}
                className={styles.refreshButton}
                title="Làm mới"
              >
                🔄
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowAdd(true)}
                className={styles.addButton}
                title="Thêm khách hàng"
              >
                <FaUserPlus />
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowExport(true)}
                className={styles.exportButton}
                title="Xuất dữ liệu"
              >
                <FaDownload />
              </Button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <TableWrapper columns={columns} data={customers} loading={loading} className="customer-table" />
        
        {/* Empty State */}
        {!loading && customers.length === 0 && (
          <div className="text-center py-5">
            <div style={{
              width: '120px',
              height: '120px',
              background: '#f8f9fa',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '3rem',
              color: '#6c757d'
            }}>
              👥
            </div>
            <h4 className="text-muted mb-3">Không có khách hàng nào</h4>
            <p className="text-muted mb-4">
              {search || Object.values(activeFilters).some(v => v !== 'all' && v !== '') 
                ? 'Không tìm thấy khách hàng nào phù hợp với bộ lọc hiện tại.'
                : 'Chưa có khách hàng nào trong hệ thống. Hãy thêm khách hàng đầu tiên!'
              }
            </p>
            {!search && Object.values(activeFilters).every(v => v === 'all' || v === '') && (
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowAdd(true)}
              >
                <FaUserPlus className="me-2" />
                Thêm khách hàng đầu tiên
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {customers.length > 0 && (
          <div className={styles.paginationContainer}>
            <Pagination className={styles.pagination}>
              {paginationItems.map((item, idx) => React.cloneElement(item, { 
                style: { 
                  background: '#fff', 
                  color: '#1C1C1E', 
                  border: '1px solid #e9ecef', 
                  borderRadius: 6, 
                  margin: '0 2px' 
                } 
              }))}
            </Pagination>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <CustomerDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        customer={selectedCustomer}
      />
      <UpdateCustomerModal
        show={showUpdate}
        onHide={() => setShowUpdate(false)}
        customer={selectedCustomer}
        onUpdate={handleUpdate}
        loading={updating}
      />
      <DeleteCustomerModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        customer={selectedCustomer}
        onDelete={handleDelete}
        loading={deleting}
      />
      <AddCustomerModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onAdd={handleAdd}
        loading={adding}
      />
      
      {/* Filter Modal */}
      <CustomerFilterModal
        show={showFilter}
        onHide={handleFilterModalClose}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        currentFilters={activeFilters}
      />

      {/* Export Modal */}
      <ExportDataModal
        show={showExport}
        onHide={() => setShowExport(false)}
        data={customers}
        columns={customerColumns}
        defaultFileName="customers"
        title="Xuất dữ liệu khách hàng"
        onExport={handleCustomExport}
      />
      
      {/* Loading Spinner */}
      {(updating || deleting || adding || loading) && (
        <LoadingSpinner 
          overlay 
          text={
            updating ? "Đang cập nhật..." :
            deleting ? "Đang xóa..." :
            adding ? "Đang thêm..." :
            "Đang tải dữ liệu..."
          }
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          bg={toastType}
          className="text-white"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toastType === 'success' ? 'Thành công' : 'Lỗi'}
            </strong>
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default CustomerListPage;
