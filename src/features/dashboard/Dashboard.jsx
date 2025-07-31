import React, { useEffect, useState, useContext } from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import { getDashboardSummary } from './DashboardAPI';
import { queryRooms } from '../rooms/RoomAPI';
import { getBookingChangeRequests } from '../requests/RequestAPI';
import { UserContext } from '../../context/UserContext';
import SummaryStats from '../../components/SummaryStats';
import { formatDate } from '../../utils/dateUtils';
import { FaExchangeAlt, FaCheck, FaTimes, FaClock, FaUser, FaCalendarAlt, FaHotel } from 'react-icons/fa';
import { LoadingSpinner, StatCard } from '../../components';

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]); // mảng trả về từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { start, end };
  });
  const [availableRooms, setAvailableRooms] = useState(0);
  const [changeRequests, setChangeRequests] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Lấy số phòng trống
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const rooms = await queryRooms();
        // Tính toán phòng trống dựa trên bookedTime
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
        
        const available = rooms.filter(r => getRoomStatus(r) === 'available').length;
        setAvailableRooms(available);
      } catch (e) {
        setAvailableRooms(0);
      }
    };
    fetchAvailableRooms();
  }, []);

  // Lấy yêu cầu thay đổi booking và tạo hoạt động gần đây
  useEffect(() => {
    const fetchChangeRequestsAndActivities = async () => {
      if (user?.role !== 'Manager' && user?.role !== 'Admin') {
        return;
      }
      
      try {
        const requests = await getBookingChangeRequests(user.token);
        setChangeRequests(requests);

        // Tạo hoạt động gần đây từ yêu cầu thay đổi booking
        const activities = requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(request => {
            const timeAgo = getTimeAgo(new Date(request.createdAt));
            let activity = {
              id: request._id,
              time: timeAgo,
              timestamp: new Date(request.createdAt)
            };

            switch (request.status) {
              case 'Pending':
                activity = {
                  ...activity,
                  icon: <FaClock />,
                  title: `Yêu cầu ${request.type === 'Update' ? 'cập nhật' : 'hủy'} booking`,
                  subtitle: `Booking #${request.bookingId} - Chờ xử lý`,
                  type: 'pending'
                };
                break;
              case 'Approved':
                activity = {
                  ...activity,
                  icon: <FaCheck />,
                  title: `Yêu cầu ${request.type === 'Update' ? 'cập nhật' : 'hủy'} đã được phê duyệt`,
                  subtitle: `Booking #${request.bookingId} - Đã xử lý`,
                  type: 'approved'
                };
                break;
              case 'Disapproved':
                activity = {
                  ...activity,
                  icon: <FaTimes />,
                  title: `Yêu cầu ${request.type === 'Update' ? 'cập nhật' : 'hủy'} bị từ chối`,
                  subtitle: `Booking #${request.bookingId} - Đã từ chối`,
                  type: 'disapproved'
                };
                break;
              default:
                activity = {
                  ...activity,
                  icon: <FaExchangeAlt />,
                  title: `Yêu cầu thay đổi booking`,
                  subtitle: `Booking #${request.bookingId}`,
                  type: 'default'
                };
            }
            return activity;
          });

        // Thêm một số hoạt động mẫu khác để làm phong phú
        const sampleActivities = [
          {
            id: 'sample1',
            icon: <FaUser />,
            title: 'Khách hàng mới đăng ký',
            subtitle: 'Nguyễn Văn A - Đã tạo tài khoản',
            time: '30 phút trước',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            type: 'user'
          },
          {
            id: 'sample2',
            icon: <FaCalendarAlt />,
            title: 'Booking mới được tạo',
            subtitle: 'Phòng 101 - Check-in: 20/01/2024',
            time: '2 giờ trước',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            type: 'booking'
          },
          {
            id: 'sample3',
            icon: <FaHotel />,
            title: 'Phòng đã được dọn dẹp',
            subtitle: 'Phòng 205 - Sẵn sàng cho khách mới',
            time: '4 giờ trước',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            type: 'room'
          }
        ];

        // Kết hợp và sắp xếp theo thời gian
        const allActivities = [...activities, ...sampleActivities]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 8);

        setRecentActivities(allActivities);
      } catch (error) {
        console.error('Error fetching change requests:', error);
        setChangeRequests([]);
        setRecentActivities([]);
      }
    };
    
    fetchChangeRequestsAndActivities();
  }, [user]);

  // Hàm tính thời gian trước
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return formatDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          startDate: toDateInputValue(dateRange.start),
          endDate: toDateInputValue(dateRange.end),
          groupBy: 'day',
        };
        const res = await getDashboardSummary(params);
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  const handleFilterChange = (filterType) => {
    const end = new Date();
    let start = new Date();

    switch (filterType) {
      case 'week':
        const dayOfWeek = end.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Chủ nhật
        start.setDate(end.getDate() - daysToMonday);
        break;
      case 'month':
        start.setDate(1);
        break;
      default:
        start.setDate(end.getDate() - 6);
    }
    setDateRange({ start, end });
  };

  const isWeekFilter = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const currentStart = new Date(dateRange.start);
    currentStart.setHours(0, 0, 0, 0);

    const currentEnd = new Date(dateRange.end);
    currentEnd.setHours(23, 59, 59, 999);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    return Math.abs(currentStart.getTime() - weekStart.getTime()) < 86400000 &&
           Math.abs(currentEnd.getTime() - todayEnd.getTime()) < 86400000;
  };

  const isMonthFilter = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const currentStart = new Date(dateRange.start);
    currentStart.setHours(0, 0, 0, 0);

    const currentEnd = new Date(dateRange.end);
    currentEnd.setHours(23, 59, 59, 999);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    return Math.abs(currentStart.getTime() - monthStart.getTime()) < 86400000 &&
           Math.abs(currentEnd.getTime() - todayEnd.getTime()) < 86400000;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className={styles.statusBadgePending}>Chờ xử lý</span>;
      case 'Approved':
        return <span className={styles.statusBadgeApproved}>Đã phê duyệt</span>;
      case 'Disapproved':
        return <span className={styles.statusBadgeDisapproved}>Đã từ chối</span>;
      default:
        return <span className={styles.statusBadgeDefault}>{status}</span>;
    }
  };

  return (
    <div className={styles.dashboardWrap}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.welcomeMessage}>
        Chào mừng bạn trở lại, {user?.fullName || 'User'}! Đây là tổng quan về hoạt động của khách sạn.
      </p>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <ButtonGroup>
            <Button 
              variant={isWeekFilter() ? 'primary' : 'outline-primary'}
              onClick={() => handleFilterChange('week')}
              className={isWeekFilter() ? styles.activeFilter : ''}
            >
              Tuần này
            </Button>
            <Button 
              variant={isMonthFilter() ? 'primary' : 'outline-primary'}
              onClick={() => handleFilterChange('month')}
              className={isMonthFilter() ? styles.activeFilter : ''}
            >
              Tháng này
            </Button>
          </ButtonGroup>
        </div>
      </div>
      
      {loading && <LoadingSpinner text="Đang tải dữ liệu dashboard..." />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <SummaryStats data={data} title="Tổng quan đặt phòng" availableRooms={availableRooms} />
          
          {/* Section hợp nhất: Yêu cầu thay đổi booking và Hoạt động gần đây */}
                      {(user?.role === 'Manager' || user?.role === 'Admin') && (
            <div className={styles.unifiedActivitySection}>
              <div className={styles.sectionHeader}>
                <h3>Quản lý yêu cầu & Hoạt động gần đây</h3>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/requests')}
                  className={styles.viewAllButton}
                >
                  Xem tất cả
                </Button>
              </div>

              <div className={styles.contentGrid}>
                {/* Cột trái: Thống kê yêu cầu */}
                <div className={styles.statsColumn}>
                  <h4>Thống kê yêu cầu thay đổi</h4>
                          <div className={styles.statsGrid}>
                            <StatCard
                              title="Tổng yêu cầu"
                      value={changeRequests.length}
                              icon={<FaExchangeAlt />}
                            />
                            <StatCard
                              title="Chờ xử lý"
                      value={changeRequests.filter(r => r.status === 'Pending').length}
                              icon={<FaClock />}
                            />
                            <StatCard
                              title="Đã phê duyệt"
                      value={changeRequests.filter(r => r.status === 'Approved').length}
                              icon={<FaCheck />}
                            />
                            <StatCard
                              title="Đã từ chối"
                      value={changeRequests.filter(r => r.status === 'Disapproved').length}
                              icon={<FaTimes />}
                            />
                          </div>
                </div>

                {/* Cột phải: Hoạt động gần đây */}
                <div className={styles.activityColumn}>
                  <h4>Hoạt động gần đây</h4>
                  <div className={styles.activityList}>
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id || index} className={`${styles.activityItem} ${styles[`activityType${activity.type}`]}`}>
                <div className={styles.activityIcon}>
                          {activity.icon}
                </div>
                <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>{activity.title}</div>
                          <div className={styles.activitySubtitle}>{activity.subtitle}</div>
                          <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
                    ))}
                </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
