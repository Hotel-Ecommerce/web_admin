import React from 'react';
import { Badge } from 'react-bootstrap';
import styles from './StatusBadge.module.scss';

const StatusBadge = ({ 
  status, 
  type = 'status', 
  size = 'md',
  className = '',
  showIcon = false 
}) => {
  // Status configurations
  const statusConfigs = {
    // Booking status
    booking: {
      Pending: { bg: 'warning', text: 'Chờ xác nhận', icon: '⏳' },
      Confirmed: { bg: 'success', text: 'Đã xác nhận', icon: '✅' },
      Cancelled: { bg: 'danger', text: 'Đã hủy', icon: '❌' },
      Completed: { bg: 'info', text: 'Hoàn thành', icon: '🏁' }
    },
    // Payment status
    payment: {
      Paid: { bg: 'success', text: 'Đã thanh toán', icon: '💰' },
      Unpaid: { bg: 'danger', text: 'Chưa thanh toán', icon: '💳' },
      Partial: { bg: 'warning', text: 'Thanh toán một phần', icon: '💸' }
    },
    // Room status
    room: {
      available: { bg: 'success', text: 'Trống', icon: '🟢' },
      occupied: { bg: 'danger', text: 'Đã thuê', icon: '🔴' },
      maintenance: { bg: 'warning', text: 'Bảo trì', icon: '🔧' },
      reserved: { bg: 'info', text: 'Đã đặt', icon: '📋' }
    },
    // Customer status
    customer: {
      active: { bg: 'success', text: 'Hoạt động', icon: '👤' },
      inactive: { bg: 'secondary', text: 'Không hoạt động', icon: '🚫' }
    },
    // Employee status
    employee: {
      active: { bg: 'success', text: 'Đang làm việc', icon: '👨‍💼' },
      inactive: { bg: 'secondary', text: 'Nghỉ việc', icon: '🚫' }
    },
    // Request status
    request: {
      Pending: { bg: 'warning', text: 'Chờ xử lý', icon: '⏳' },
      Approved: { bg: 'success', text: 'Đã phê duyệt', icon: '✅' },
      Disapproved: { bg: 'danger', text: 'Đã từ chối', icon: '❌' }
    }
  };

  // Get configuration based on type and status
  const getConfig = () => {
    const configs = statusConfigs[type] || statusConfigs.booking;
    return configs[status] || { bg: 'secondary', text: status || 'Không xác định', icon: '❓' };
  };

  const config = getConfig();

  return (
    <Badge 
      bg={config.bg} 
      className={`${styles.statusBadge} ${styles[size]} ${className}`}
    >
      {showIcon && config.icon && (
        <span className={styles.badgeIcon}>{config.icon}</span>
      )}
      <span className={styles.badgeText}>{config.text}</span>
    </Badge>
  );
};

export default StatusBadge; 