import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Row, Col, Pagination } from 'react-bootstrap';
import { getEmployees } from '../../EmployeeAPI';
import styles from './EmployeeList.module.scss';
import IconButton from '../../../../components/IconButton';
import { formatDate } from '../../../../utils/dateUtils';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaUserCheck, 
  FaUserTimes,
  FaUserCog,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaUsers
} from 'react-icons/fa';

const EmployeeList = ({ 
  token, 
  reload, 
  searchTerm = '',
  onEdit, 
  onDelete, 
  onDetail,
  onLoadingChange,
  onStatsChange,
  onEmployeesChange
}) => {
  // Debug logs - chỉ log một lần khi component mount
  useEffect(() => {
    console.log('EmployeeList mounted with token:', token ? 'Token exists' : 'No token');
  }, [token]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        onLoadingChange?.(true);
        const data = await getEmployees(token);
        setEmployees(data);
        onEmployeesChange?.(data);
        
        // Calculate stats
        const total = data.length;
        const active = data.filter(emp => emp.status === 'active').length;
        const inactive = data.filter(emp => emp.status === 'inactive').length;
        const managers = data.filter(emp => emp.role === 'Manager').length;
        const admins = data.filter(emp => emp.role === 'Admin').length;
        
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        const newThisMonth = data.filter(emp => {
          const createdDate = new Date(emp.createdAt);
          return createdDate >= thisMonth;
        }).length;
        
        onStatsChange?.({
          total,
          active,
          inactive,
          newThisMonth,
          managers,
          admins
        });
      } catch (err) {
        setError('Lỗi khi tải danh sách nhân viên');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };
    
    if (token) {
      fetchEmployees();
    }
  }, [token, reload, onLoadingChange, onStatsChange, onEmployeesChange]);

  // Hàm lọc nhân viên theo search
  const getFilteredEmployees = () => {
    let filtered = employees;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm)
      );
    }
    
    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge bg="success"><FaUserCheck /> Đang làm việc</Badge>;
    } else {
      return <Badge bg="danger"><FaUserTimes /> Nghỉ việc</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'Manager') {
      return <Badge bg="primary"><FaUserCog /> Quản lý</Badge>;
    } else {
      return <Badge bg="warning" text="dark"><FaIdCard /> Admin</Badge>;
    }
  };



  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.employeeList}>
      {/* Header */}
      <div className={styles.listHeader}>
        <div>
          <h3 className={styles.listTitle}>Danh sách nhân viên</h3>
          <p className={styles.listSubtitle}>
            Hiển thị {filteredEmployees.length} nhân viên
            {searchTerm && ` cho "${searchTerm}"`}
          </p>
        </div>

      </div>



      {/* Table */}
      <div className={styles.tableContainer}>
        <Table responsive hover className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>STT</th>
              <th>Thông tin</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              {/* <th>Trạng thái</th> */}
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((emp, idx) => (
              <tr key={emp._id} className={styles.tableRow}>
                <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td>
                  <div className={styles.employeeInfo}>
                    <div className={styles.employeeName}>{emp.fullName}</div>
                    <div className={styles.employeeId}>ID: {emp._id.slice(-6)}</div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <FaEnvelope className={styles.contactIcon} />
                      {emp.email}
                    </div>
                    <div className={styles.contactItem}>
                      <FaPhone className={styles.contactIcon} />
                      {emp.phone}
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(emp.role)}</td>
                {/* <td>{getStatusBadge(emp.status)}</td> */}
                <td>
                  <div className={styles.dateInfo}>
                    <FaCalendar className={styles.dateIcon} />
                    {formatDate(emp.createdAt)}
                  </div>
                </td>
                <td className={styles.actions}>
                  <IconButton icon={FaEye} color="#1976d2" onClick={() => onDetail && onDetail(emp)} />
                  <IconButton icon={FaEdit} color="#ff9800" onClick={() => onEdit && onEdit(emp)} />
                  <IconButton icon={FaTrash} color="#d32f2f" onClick={() => onDelete && onDelete(emp)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination className={styles.pagination}>
            <Pagination.First 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            
            <Pagination.Next 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Empty state */}
      {filteredEmployees.length === 0 && (
        <div className={styles.emptyState}>
          <FaUsers size={48} className="text-muted mb-3" />
          <h4>Không tìm thấy nhân viên</h4>
          <p>
            {searchTerm 
              ? `Không có nhân viên nào phù hợp với "${searchTerm}"`
              : 'Chưa có nhân viên nào trong hệ thống'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 