import React, { useState, useContext } from 'react';
import EmployeeList from './components/EmployeeList/EmployeeList';
import AddEmployeeModal from './components/AddEmployeeModal/AddEmployeeModal';
import UpdateEmployeeModal from './components/UpdateEmployeeModal/UpdateEmployeeModal';
import DeleteEmployeeModal from './components/DeleteEmployeeModal/DeleteEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal/EmployeeDetailModal';
import { UserContext } from '../../context/UserContext';
import styles from './EmployeePage.module.scss';
import { FaPlusCircle } from 'react-icons/fa';

const EmployeePage = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload(r => !r);

  return (
    <div className={styles.employeePage}>
      <div className={styles.header}>
        <h1>Quản lý nhân viên</h1>
        <button className={styles.addBtn} title="Thêm nhân viên" onClick={() => setShowAdd(true)}>
          <FaPlusCircle size={28} style={{color:'#43a047'}} />
        </button>
      </div>
      <EmployeeList
        token={token}
        reload={reload}
        onEdit={emp => { setSelectedEmployee(emp); setShowUpdate(true); }}
        onDelete={emp => { setSelectedEmployee(emp); setShowDelete(true); }}
        onDetail={emp => { setSelectedEmployee(emp); setShowDetail(true); }}
      />
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
    </div>
  );
};

export default EmployeePage; 