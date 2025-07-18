import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';

jest.mock('./DashboardAPI', () => ({
  getDashboardSummary: jest.fn().mockResolvedValue({
    occupancyRate: 80,
    checkInCount: 5,
    checkOutCount: 3,
    revenue: 1000000,
    roomStatus: [
      { number: '101', status: 'occupied' },
      { number: '102', status: 'dueout' }
    ],
    recentBookings: [
      { customerName: 'A', checkInDate: '2024-07-20' },
      { customerName: 'B', checkInDate: '2024-07-21' }
    ],
    chartData: [
      { day: '2024-07-20', value: 80 },
      { day: '2024-07-21', value: 60 }
    ]
  })
}));

describe('Dashboard', () => {
  it('renders dashboard title and stat cards', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/bảng điều khiển/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/nhận phòng/i)).toBeInTheDocument());
    expect(screen.getByText(/trả phòng/i)).toBeInTheDocument();
    expect(screen.getByText(/doanh thu/i)).toBeInTheDocument();
  });
}); 