import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import EmployeeList from './components/EmployeeList/EmployeeList';
import AddEmployeeModal from './components/AddEmployeeModal/AddEmployeeModal';
import UpdateEmployeeModal from './components/UpdateEmployeeModal/UpdateEmployeeModal';
import DeleteEmployeeModal from './components/DeleteEmployeeModal/DeleteEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal/EmployeeDetailModal';
import EmployeeFilterModal from './components/EmployeeFilterModal/EmployeeFilterModal';
import { UserContext } from '../../context/UserContext';
import styles from './EmployeePage.module.scss';
import { formatDate } from '../../utils/dateUtils';
import { 
  FaPlusCircle, 
  FaUsers, 
  FaUserPlus, 
  FaUserCheck, 
  FaUserTimes, 
  FaDownload,
  FaSearch,
  FaFilter,
  FaRedo,
  FaUserCog,
  FaIdCard,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { 
  LoadingSpinner, 
  StatCard, 
  SearchBox,
  ExportDataModal 
} from '../../components';

const EmployeePage = () => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');
  
  // Debug logs - chỉ log một lần khi component mount
  useEffect(() => {
    // Component mounted
  }, []);

  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    managers: 0,
    admins: 0
  });
  // State cho filter
  const [filter, setFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const handleReload = () => setReload(r => !r);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const exportColumns = [
    { key: 'fullName', header: 'Họ tên', accessor: 'fullName' },
    { key: 'email', header: 'Email', accessor: 'email' },
    { key: 'phone', header: 'Số điện thoại', accessor: 'phone' },
    { key: 'role', header: 'Vai trò', accessor: 'role' },
    { key: 'status', header: 'Trạng thái', accessor: 'status' },
    { key: 'createdAt', header: 'Ngày tạo', accessor: 'createdAt' }
  ];

  const handleCustomExport = (exportConfig) => {
    const { data, columns, format } = exportConfig;
    
    // Transform data for export
    const exportData = data.map(employee => {
      const transformed = {};
      columns.forEach(colKey => {
        let value = employee[colKey];
        
        if (colKey === 'createdAt') {
          value = formatDate(value);
        } else if (colKey === 'role') {
          value = value === 'Manager' ? 'Quản lý' : 'Admin';
        } else if (colKey === 'status') {
          value = value === 'active' ? 'Đang làm việc' : 'Nghỉ việc';
        }
        
        transformed[colKey] = value || '';
      });
      return transformed;
    });
    
    exportConfig.data = exportData;
    
    if (format === 'csv') {
      exportToCSV(exportConfig);
    } else if (format === 'excel') {
      exportToExcel(exportConfig);
    }
  };

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
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Không thể xuất file Excel. Vui lòng thử xuất CSV!');
    }
  };

  return (
    <Container fluid className={styles.employeePageContainer}>
      {/* Header */}
      <div className={styles.employeeHeader}>
        <div>
          <h2 className={styles.employeeTitle}>Quản lý nhân viên</h2>
          <p className={styles.employeeSubtitle}>Quản lý thông tin và phân quyền nhân viên hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className={styles.statsRow}>
        <Col md={3} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Tổng nhân viên"
            value={stats.total}
            icon={<FaUsers />}
            color="#00AEEF"
          />
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Mới tháng này"
            value={stats.newThisMonth}
            icon={<FaUserPlus />}
            color="#ffc107"
          />
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Quản lý"
            value={stats.managers}
            icon={<FaUserCog />}
            color="#6f42c1"
          />
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-3">
          <StatCard
            title="Admin"
            value={stats.admins}
            icon={<FaIdCard />}
            color="#fd7e14"
          />
        </Col>
      </Row>

      {/* Employee List with Toolbar */}
      <Card className={styles.employeeListCard}>
        <Card.Header className={styles.cardHeader}>
          <div className={styles.toolbarContainer}>
            <div className={styles.searchSection}>
              <SearchBox
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                debounceMs={500}
              />
            </div>
            <div className={styles.actionButtons}>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleReload}
                className={styles.toolbarBtn}
              >
                <FaRedo />
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleExport}
                className={styles.toolbarBtn}
              >
                <FaDownload />
              </Button>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={() => setShowFilter(true)}
                className={styles.toolbarBtn}
              >
                <FaFilter />
              </Button>
              <Button 
                variant="success" 
                size="sm"
                onClick={() => setShowAdd(true)}
                className={styles.toolbarBtn}
              >
                <FaPlusCircle />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className={styles.cardBody}>
          <EmployeeList
            token={token}
            reload={reload}
            searchTerm={searchTerm}
            filter={filter}
            onEdit={emp => { setSelectedEmployee(emp); setShowUpdate(true); }}
            onDelete={emp => { setSelectedEmployee(emp); setShowDelete(true); }}
            onDetail={emp => { setSelectedEmployee(emp); setShowDetail(true); }}
            onLoadingChange={setLoading}
            onStatsChange={setStats}
            onEmployeesChange={setEmployees}
          />
        </Card.Body>
      </Card>

      {/* Loading Spinner */}
      {loading && (
        <LoadingSpinner 
          overlay 
          text="Đang tải dữ liệu nhân viên..." 
        />
      )}

      {/* Modals */}
      <AddEmployeeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        token={token}
        onAdded={handleReload}
      />
      <UpdateEmployeeModal
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        employee={selectedEmployee}
        token={token}
        onUpdated={handleReload}
      />
      <DeleteEmployeeModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        employee={selectedEmployee}
        token={token}
        onDeleted={handleReload}
      />
      <EmployeeDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        employee={selectedEmployee}
      />

      {/* Export Modal */}
      <ExportDataModal
        show={showExport}
        onHide={() => setShowExport(false)}
        data={employees}
        columns={exportColumns}
        defaultFileName="employees"
        title="Xuất dữ liệu nhân viên"
        onExport={handleCustomExport}
      />

      {/* Modal lọc nâng cao chỉ mở khi showFilter true */}
      {showFilter && (
        <EmployeeFilterModal
          onClose={() => setShowFilter(false)}
          onApply={filterValues => setFilter(filterValues)}
        />
      )}
    </Container>
  );
};

export default EmployeePage; 