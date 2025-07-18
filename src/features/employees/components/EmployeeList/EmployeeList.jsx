import React, { useEffect, useState } from 'react';
import { getEmployees } from '../../EmployeeAPI';
import styles from './EmployeeList.module.scss';
import EmployeeFilterModal from "../EmployeeFilterModal/EmployeeFilterModal";
import IconButton from '../../../../components/IconButton';
import { FaEye, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const EmployeeList = ({ token, reload, onEdit, onDelete, onDetail }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState(null);

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const handleApplyFilter = (filterValues) => {
    setFilter(filterValues);
    // TODO: Thực hiện lọc danh sách nhân viên dựa trên filterValues
    console.log('Filter applied:', filterValues);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees(token);
        setEmployees(data);
      } catch (err) {
        setError('Lỗi khi tải danh sách nhân viên');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchEmployees();
  }, [token, reload]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Hàm lọc nhân viên theo filter
  const getFilteredEmployees = () => {
    if (!filter) return employees;
    return employees.filter(emp => {
      // Lọc theo tên
      if (filter.fullName && !emp.fullName.toLowerCase().includes(filter.fullName.toLowerCase())) {
        return false;
      }
      // Lọc theo vai trò (Admin/Manager)
      if (filter.role && emp.role !== filter.role) {
        return false;
      }
      // Lọc theo số điện thoại
      if (filter.phone && (!emp.phone || !emp.phone.includes(filter.phone))) {
        return false;
      }
      return true;
    });
  };
  const filteredEmployees = getFilteredEmployees();

  return (
    <div className={styles.employeeList}>
      <h2>Danh sách nhân viên</h2>
      <button onClick={handleOpenFilterModal} className={styles.filterBtn} title="Lọc nhân viên" style={{background:'none',padding:0,border:'none'}}>
        <IconButton icon={FaFilter} color="#1976d2" size={20} title="Lọc nhân viên" onClick={handleOpenFilterModal} />
      </button>
      {isFilterModalOpen && (
        <EmployeeFilterModal onClose={handleCloseFilterModal} onApply={handleApplyFilter} />
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td style={{display:'flex',gap:8}}>
                <IconButton icon={FaEye} color="#1976d2" title="Xem chi tiết" onClick={() => onDetail && onDetail(emp)} />
                <IconButton icon={FaEdit} color="#ff9800" title="Sửa" onClick={() => onEdit && onEdit(emp)} />
                <IconButton icon={FaTrash} color="#d32f2f" title="Xóa" onClick={() => onDelete && onDelete(emp)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList; 