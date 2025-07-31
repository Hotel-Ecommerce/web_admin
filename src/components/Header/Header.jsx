import React, { useState, useEffect, useContext } from 'react';
import { 
  Navbar, 
  Nav, 
  Container, 
  Button, 
  Badge, 
  Modal, 
  Form, 
  Spinner, 
  Alert, 
  ToastContainer, 
  Toast 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaKey, 
  FaTimes,
  FaBars
} from 'react-icons/fa';
import { getBookingChangeRequests } from '../../features/requests/RequestAPI';
import { getEmployeeById } from '../../features/employees/EmployeeAPI';
import { signout } from '../../features/auth/AuthAPI';
import ChangePasswordModal from './ChangePasswordModal';
import CustomModal from './CustomModal';
import styles from './Header.module.scss';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = user?.token;

  // Lấy thông tin employee khi mở modal (chỉ gọi API nếu là Manager)
  useEffect(() => {
    const fetchEmployee = async () => {
      if (showModal && user?._id && token && user?.role === 'Manager') {
        setLoading(true);
        setError('');
        try {
          const data = await getEmployeeById(user._id, token);
          setEmployee(data);
        } catch (e) {
          setError('Không thể tải thông tin cá nhân');
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu không phải Manager, dùng thông tin từ context
        setEmployee(null);
      }
    };
    fetchEmployee();
  }, [showModal, user, token]);

  // Lấy số lượng yêu cầu thay đổi booking đang chờ xử lý
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if ((user?.role === 'Manager' || user?.role === 'Admin') && token) {
        try {
          const requests = await getBookingChangeRequests(token);
          const pending = requests.filter(r => r.status === 'Pending').length;
          
          // Phát âm thanh thông báo và hiển thị toast nếu có yêu cầu mới
          if (pending > pendingRequests && pendingRequests > 0) {
            // Tạo âm thanh thông báo đơn giản
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.play().catch(() => {}); // Ignore errors if audio fails
            
            // Hiển thị toast notification
            const newRequests = pending - pendingRequests;
            setToastMessage(`${newRequests} yêu cầu thay đổi booking mới!`);
            setShowToast(true);
          }
          
          setPendingRequests(pending);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      }
    };

    fetchPendingRequests();
    
    // Cập nhật mỗi 30 giây
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, [user, token, pendingRequests]);

  // Đăng xuất
  const handleLogout = async () => {
    setShowModal(false);
    try {
      await signout();
    } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  // Chuyển đến trang quản lý yêu cầu
  const handleGoToRequests = () => {
    navigate('/requests');
  };

  return (
    <header className={styles.header}>
      <div className={styles.right}>
        {/* Thông báo yêu cầu thay đổi booking (chỉ cho Manager/Admin) */}
        {(user?.role === 'Manager' || user?.role === 'Admin') && pendingRequests > 0 && (
          <div className={styles.notificationBadge} onClick={handleGoToRequests}>
            <FaBell style={{ color: '#222' }} />
            <span className={styles.badgeCount}>{pendingRequests}</span>
            <div className={styles.tooltip}>
              {pendingRequests} yêu cầu thay đổi booking đang chờ xử lý
            </div>
          </div>
        )}
        
        <div
          className={styles.avatar}
          onClick={() => setShowModal(true)}
          tabIndex={0}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <span role="img" aria-label="user">👤</span>
        </div>
      </div>
      
      {/* Modal thông tin cá nhân sử dụng CustomModal */}
      <CustomModal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        title="Thông tin cá nhân"
      >
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {(employee?.fullName || user?.fullName || user?.name || 'Không xác định')}
            </div>
            <div style={{ color: '#00AEEF', fontWeight: 500 }}>
              {(employee?.role || user?.role || 'Không xác định')}
            </div>
            <div style={{ marginTop: 8 }}><b>Email:</b> {(employee?.email || user?.email || 'Không xác định')}</div>
            <div><b>Số điện thoại:</b> {(employee?.phone || user?.phone || 'Không xác định')}</div>
            
            {/* Thông báo yêu cầu thay đổi booking trong modal */}
            {(user?.role === 'Manager' || user?.role === 'Admin') && pendingRequests > 0 && (
              <Alert variant="warning" style={{ marginTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaBell />
                  <strong>{pendingRequests} yêu cầu thay đổi booking</strong> đang chờ xử lý
                </div>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    setShowModal(false);
                    handleGoToRequests();
                  }}
                >
                  Xem ngay
                </Button>
              </Alert>
            )}
            
            {/* Nút đổi mật khẩu luôn hiển thị cho mọi user đăng nhập */}
            <Button
              variant="primary"
              style={{ marginTop: 18, borderRadius: 6, fontWeight: 500 }}
              onClick={() => setShowChangePassword(true)}
            >
              Đổi mật khẩu
            </Button>
            <Button
              variant="danger"
              style={{ marginTop: 18, marginLeft: 12, borderRadius: 6, fontWeight: 500 }}
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Đăng xuất
            </Button>
          </>
        )}
      </CustomModal>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      />

      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          bg="warning"
        >
          <Toast.Header>
            <FaBell className="me-2" />
            <strong className="me-auto">Thông báo</strong>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowToast(false)}
              className="p-0"
            >
              <FaTimes />
            </Button>
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </header>
  );
};

export default Header;