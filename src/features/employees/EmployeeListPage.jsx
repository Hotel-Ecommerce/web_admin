import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Pagination, Spinner } from 'react-bootstrap';
import { queryEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee } from './EmployeeAPI';
import EmployeeDetailModal from './components/EmployeeDetailModal/EmployeeDetailModal';
import DeleteEmployeeModal from './components/DeleteEmployeeModal/DeleteEmployeeModal';
import AddEmployeeModal from './components/AddEmployeeModal/AddEmployeeModal';
import UpdateEmployeeModal from './components/UpdateEmployeeModal/UpdateEmployeeModal';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import styles from './EmployeeListPage.module.scss';

const PAGE_SIZE = 20;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  // Fetch employee list from API
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params = { page, size: PAGE_SIZE };
        if (search) params.q = search;
        if (roleFilter) params.role = roleFilter;
        const data = await queryEmployees(params);
        setEmployees(data.employees || data); // fallback nếu API trả về array
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, search, roleFilter, refresh]);

  // Xem chi tiết nhân viên
  const handleViewDetail = async (id) => {
    setLoading(true);
    try {
      const employee = await getEmployeeById(id);
      setSelectedEmployee(employee);
      setShowDetail(true);
    } catch {
      setSelectedEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật nhân viên
  const handleUpdate = async (employee) => {
    setUpdating(true);
    try {
      await updateEmployee(employee);
      setShowUpdate(false);
      setRefresh(r => !r);
    } catch {
      // handle error
    } finally {
      setUpdating(false);
    }
  };

  // Xoá nhân viên
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteEmployee(id);
      setShowDelete(false);
      setRefresh(r => !r);
    } catch {
      // handle error
    } finally {
      setDeleting(false);
    }
  };

  // Thêm nhân viên
  const handleAdd = async (employee) => {
    setAdding(true);
    try {
      await addEmployee(employee);
      setShowAdd(false);
      setRefresh(r => !r);
    } catch {
      // handle error
    } finally {
      setAdding(false);
    }
  };

  // Table columns
  const columns = [
    { header: 'Họ tên', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Số điện thoại', accessor: 'phone' },
    { header: 'Vai trò', accessor: 'role' },
    { header: 'Mật khẩu', accessor: 'password', cell: (row) => row.password || '' },
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleViewDetail(row._id)}>👁 Xem</Button>
          <Button variant="outline-warning" size="sm" className="me-2" onClick={() => { setSelectedEmployee(row); setShowUpdate(true); }}>✏ Sửa</Button>
          <Button variant="outline-danger" size="sm" onClick={() => { setSelectedEmployee(row); setShowDelete(true); }}>🗑 Xoá</Button>
        </>
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
    <Container className={styles.employeePageContainer}>
      <div className={styles.employeeHeader}>
        <h2 className={styles.employeeTitle}>Danh sách nhân viên</h2>
        <Button variant="success" className={styles.addEmployeeBtn} onClick={() => setShowAdd(true)}>
          + Thêm nhân viên
        </Button>
      </div>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            style={{ display: 'inline-block', width: '55%' }}
          />
          <Form.Select
            className="ms-2"
            style={{ display: 'inline-block', width: '30%' }}
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(0); }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </Form.Select>
          <Button variant="success" className="ms-2 d-none">+ Thêm nhân viên</Button>
        </Col>
      </Row>
      <TableWrapper columns={columns} data={employees} loading={loading} />
      <Row className="mt-3">
        <Col>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
      <EmployeeDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        employee={selectedEmployee}
      />
      <UpdateEmployeeModal
        show={showUpdate}
        onHide={() => setShowUpdate(false)}
        employee={selectedEmployee}
        onUpdate={handleUpdate}
        loading={updating}
      />
      <DeleteEmployeeModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        employee={selectedEmployee}
        onDelete={handleDelete}
        loading={deleting}
      />
      <AddEmployeeModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onAdd={handleAdd}
        loading={adding}
      />
      {(updating || deleting || adding || loading) && <Spinner animation="border" className="position-fixed top-50 start-50 translate-middle" />}
    </Container>
  );
};

export default EmployeeListPage; 