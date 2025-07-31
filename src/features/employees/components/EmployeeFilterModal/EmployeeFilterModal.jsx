import React, { useState } from 'react';
import styles from '../EmployeeDetailModal/EmployeeDetailModal.module.scss';
import { FaSyncAlt, FaCheck, FaTimes } from 'react-icons/fa';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';

const initialFilter = {
  fullName: '',
  role: '',
  phone: '',
};

const EmployeeFilterModal = ({ onClose, onApply }) => {
  const [filter, setFilter] = useState(initialFilter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    setFilter(initialFilter);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Lọc nhân viên</h3>
        <div className={styles.detailRow}>
          <span>Họ tên:</span>
          <input
            type="text"
            name="fullName"
            value={filter.fullName}
            onChange={handleChange}
            placeholder="Nhập tên nhân viên"
          />
        </div>
        <div className={styles.detailRow}>
          <span>Vai trò:</span>
          <select name="role" value={filter.role} onChange={handleChange}>
            <option value="">Tất cả</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div className={styles.detailRow}>
          <span>Số điện thoại:</span>
          <input
            type="text"
            name="phone"
            value={filter.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleReset} style={{background:'#eee',color:'#888',marginRight:8,borderRadius:'50%'}}>
            <FaSyncAlt size={16} />
          </button>
          <button type="button" onClick={handleApply} style={{background:'#43a047',color:'#fff',marginRight:8,borderRadius:'50%'}}>
            <FaCheck size={16} />
          </button>
          <button type="button" onClick={onClose} style={{background:'#d32f2f',color:'#fff',marginLeft:8,borderRadius:'50%'}}>
            <FaTimes size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilterModal; 