// src/features/customers/CustomerListPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Pagination, Spinner } from 'react-bootstrap';
import TableWrapper from '../../components/TableWrapper/TableWrapper';
import { queryCustomers, getCustomerById, updateCustomer, deleteCustomer } from './CustomerAPI';
import CustomerDetailModal from './components/CustomerDetailModal/CustomerDetailModal';
import UpdateCustomerModal from './components/UpdateCustomerModal/UpdateCustomerModal';
import DeleteCustomerModal from './components/DeleteCustomerModal/DeleteCustomerModal';
import AddCustomerModal from './components/AddCustomerModal/AddCustomerModal';
import styles from './CustomerListPage.module.scss';

const PAGE_SIZE = 20;

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
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

  // Fetch customer list from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const params = { page, size: PAGE_SIZE };
        if (search) params.q = search;
        const data = await queryCustomers(params);
        setCustomers(data.customers || data); // fallback if API returns array
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [page, search, refresh]);

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
      // Gọi API thêm khách hàng (tạm dùng updateCustomer, sẽ sửa lại khi có API addCustomer)
      await updateCustomer(customer);
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
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <>
          <Button style={{background:'#00AEEF', border:'none', color:'#fff'}} size="sm" className="me-2" onClick={() => handleViewDetail(row._id)}>👁 Xem</Button>
          <Button style={{background:'#ffc107', border:'none', color:'#1C1C1E'}} size="sm" className="me-2" onClick={() => { setSelectedCustomer(row); setShowUpdate(true); }}>✏ Sửa</Button>
          <Button style={{background:'#dc3545', border:'none', color:'#fff'}} size="sm" onClick={() => { setSelectedCustomer(row); setShowDelete(true); }}>🗑 Xoá</Button>
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
    <Container className={styles.customerPageContainer}>
      <div className={styles.customerHeader}>
        <h2 className={styles.customerTitle}>Danh sách khách hàng</h2>
        <Button variant="success" className={styles.addCustomerBtn} onClick={() => setShowAdd(true)}>
          + Thêm khách hàng
        </Button>
      </div>
      <Row className="mb-3">
        <Col md={6} className="text-end ms-auto">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            style={{ display: 'inline-block', width: '70%', background: '#fff', color: '#1C1C1E', border: '1.5px solid #e9ecef', borderRadius: 8 }}
          />
        </Col>
      </Row>
      <TableWrapper columns={columns} data={customers} loading={loading} className="customer-table" />
      {customers.length > 0 && (
        <Row className="mt-3">
          <Col>
            <Pagination>
              {paginationItems.map((item, idx) => React.cloneElement(item, { style: { background: '#fff', color: '#1C1C1E', border: '1px solid #e9ecef', borderRadius: 6, margin: '0 2px' } }))}
            </Pagination>
          </Col>
        </Row>
      )}
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
      {(updating || deleting || adding || loading) && <Spinner animation="border" className="position-fixed top-50 start-50 translate-middle" />}
    </Container>
  );
};

export default CustomerListPage;
