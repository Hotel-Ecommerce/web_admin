// Mock data for Statistics Dashboard
// This file provides realistic mock data for testing and development

// Generate random date within a range
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate booking statistics for the last 30 days
const generateBookingStats = (days = 30) => {
  const stats = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const totalBookings = Math.floor(Math.random() * 20) + 5; // 5-25 bookings per day
    const confirmedBookings = Math.floor(totalBookings * (0.7 + Math.random() * 0.2)); // 70-90% confirmation rate
    const totalRevenue = totalBookings * (Math.floor(Math.random() * 500000) + 300000); // 300k-800k per booking
    
    stats.push({
      date: date.toISOString().slice(0, 10),
      totalBookings,
      confirmedBookings,
      cancelledBookings: totalBookings - confirmedBookings,
      totalRevenue,
      averageRevenue: Math.round(totalRevenue / totalBookings)
    });
  }
  
  return stats;
};

// Comprehensive statistics mock data
export const mockComprehensiveStats = {
  booking: {
    total: 847,
    confirmed: 723,
    cancelled: 124,
    confirmationRate: 85.4,
    cancellationRate: 14.6
  },
  revenue: {
    total: 284750000,
    paid: 256275000,
    unpaid: 28475000,
    averagePerBooking: 336000
  },
  customer: {
    newCustomers: 156,
    totalCustomers: 423,
    uniqueCustomers: 398,
    averageBookingsPerCustomer: 2.1
  },
  room: {
    total: 45,
    totalCapacity: 180,
    averagePrice: 850000,
    roomTypes: [
      { _id: 'Standard', count: 20, averagePrice: 500000 },
      { _id: 'Deluxe', count: 15, averagePrice: 800000 },
      { _id: 'Suite', count: 10, averagePrice: 1200000 }
    ]
  },
  requests: {
    pending: 8,
    approved: 23,
    rejected: 5,
    total: 36
  }
};

// Real-time statistics mock data
export const mockRealTimeStats = {
  todayBookings: 12,
  todayRevenue: 4200000,
  totalRooms: 45,
  pendingRequests: 8,
  timestamp: new Date().toISOString()
};

// Booking statistics for charts
export const mockBookingStats = generateBookingStats(30);

// Room type distribution
export const mockRoomTypeStats = [
  { type: 'Standard', count: 20, occupancy: 85, revenue: 8500000 },
  { type: 'Deluxe', count: 15, occupancy: 92, revenue: 10800000 },
  { type: 'Suite', count: 10, occupancy: 78, revenue: 9400000 }
];

// Customer statistics by month
export const mockCustomerStats = [
  { month: 'Jan', newCustomers: 45, totalBookings: 156, revenue: 52000000 },
  { month: 'Feb', newCustomers: 38, totalBookings: 142, revenue: 48000000 },
  { month: 'Mar', newCustomers: 52, totalBookings: 168, revenue: 56000000 },
  { month: 'Apr', newCustomers: 41, totalBookings: 145, revenue: 49000000 },
  { month: 'May', newCustomers: 48, totalBookings: 162, revenue: 54000000 },
  { month: 'Jun', newCustomers: 55, totalBookings: 178, revenue: 60000000 },
  { month: 'Jul', newCustomers: 62, totalBookings: 195, revenue: 65000000 },
  { month: 'Aug', newCustomers: 58, totalBookings: 182, revenue: 61000000 },
  { month: 'Sep', newCustomers: 51, totalBookings: 165, revenue: 55000000 },
  { month: 'Oct', newCustomers: 47, totalBookings: 158, revenue: 53000000 },
  { month: 'Nov', newCustomers: 43, totalBookings: 149, revenue: 50000000 },
  { month: 'Dec', newCustomers: 49, totalBookings: 161, revenue: 54000000 }
];

// Revenue trends by week
export const mockRevenueTrends = [
  { week: 'Week 1', revenue: 12500000, bookings: 45, averageBooking: 278000 },
  { week: 'Week 2', revenue: 13800000, bookings: 52, averageBooking: 265000 },
  { week: 'Week 3', revenue: 14200000, bookings: 48, averageBooking: 296000 },
  { week: 'Week 4', revenue: 15600000, bookings: 55, averageBooking: 284000 }
];

// Top performing rooms
export const mockTopRooms = [
  { roomNumber: '101', type: 'Standard', bookings: 28, revenue: 14000000, occupancy: 93 },
  { roomNumber: '201', type: 'Deluxe', bookings: 25, revenue: 20000000, occupancy: 89 },
  { roomNumber: '301', type: 'Suite', bookings: 22, revenue: 26400000, occupancy: 85 },
  { roomNumber: '102', type: 'Standard', bookings: 26, revenue: 13000000, occupancy: 91 },
  { roomNumber: '202', type: 'Deluxe', bookings: 24, revenue: 19200000, occupancy: 87 }
];

// Payment statistics
export const mockPaymentStats = {
  totalPayments: 723,
  paidPayments: 698,
  unpaidPayments: 25,
  paymentRate: 96.5,
  averagePaymentTime: 2.3, // days
  paymentMethods: [
    { method: 'Credit Card', count: 456, percentage: 63.1 },
    { method: 'Bank Transfer', count: 189, percentage: 26.1 },
    { method: 'Cash', count: 78, percentage: 10.8 }
  ]
};

// Cancellation reasons
export const mockCancellationReasons = [
  { reason: 'Change of plans', count: 45, percentage: 36.3 },
  { reason: 'Found better price', count: 28, percentage: 22.6 },
  { reason: 'Emergency', count: 23, percentage: 18.5 },
  { reason: 'Weather issues', count: 15, percentage: 12.1 },
  { reason: 'Other', count: 13, percentage: 10.5 }
];

// Customer satisfaction scores
export const mockSatisfactionStats = {
  averageRating: 4.6,
  totalReviews: 687,
  ratingDistribution: [
    { rating: 5, count: 412, percentage: 60.0 },
    { rating: 4, count: 206, percentage: 30.0 },
    { rating: 3, count: 48, percentage: 7.0 },
    { rating: 2, count: 15, percentage: 2.2 },
    { rating: 1, count: 6, percentage: 0.8 }
  ]
};

// Seasonal trends
export const mockSeasonalTrends = [
  { month: 'January', bookings: 156, revenue: 52000000, trend: 'up' },
  { month: 'February', bookings: 142, revenue: 48000000, trend: 'down' },
  { month: 'March', bookings: 168, revenue: 56000000, trend: 'up' },
  { month: 'April', bookings: 145, revenue: 49000000, trend: 'down' },
  { month: 'May', bookings: 162, revenue: 54000000, trend: 'up' },
  { month: 'June', bookings: 178, revenue: 60000000, trend: 'up' },
  { month: 'July', bookings: 195, revenue: 65000000, trend: 'up' },
  { month: 'August', bookings: 182, revenue: 61000000, trend: 'down' },
  { month: 'September', bookings: 165, revenue: 55000000, trend: 'down' },
  { month: 'October', bookings: 158, revenue: 53000000, trend: 'down' },
  { month: 'November', bookings: 149, revenue: 50000000, trend: 'down' },
  { month: 'December', bookings: 161, revenue: 54000000, trend: 'up' }
];

// Export all mock data
export const mockStatisticsData = {
  comprehensiveStats: mockComprehensiveStats,
  realTimeStats: mockRealTimeStats,
  bookingStats: mockBookingStats,
  roomTypeStats: mockRoomTypeStats,
  customerStats: mockCustomerStats,
  revenueTrends: mockRevenueTrends,
  topRooms: mockTopRooms,
  paymentStats: mockPaymentStats,
  cancellationReasons: mockCancellationReasons,
  satisfactionStats: mockSatisfactionStats,
  seasonalTrends: mockSeasonalTrends
};

export default mockStatisticsData; 