import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RoomListPage from './RoomListPage';

// Mock TableWrapper để đơn giản hóa test
jest.mock('../../components/TableWrapper/TableWrapper', () => ({ columns, data }) => (
  <table data-testid="room-table">
    <tbody>
      {data.map((row, idx) => <tr key={idx}><td>{row._id || idx}</td></tr>)}
    </tbody>
  </table>
));

// Mock API
jest.mock('./RoomAPI', () => ({
  __esModule: true,
  default: {
    getRoomList: jest.fn().mockResolvedValue([
      { _id: '1', roomNumber: '101', type: 'Standard' },
      { _id: '2', roomNumber: '102', type: 'Deluxe' }
    ])
  }
}));

describe('RoomListPage', () => {
  it('renders room page title', async () => {
    render(<RoomListPage />);
    expect(screen.getByText(/danh sách phòng/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('room-table')).toBeInTheDocument());
  });

  it('renders room table', async () => {
    render(<RoomListPage />);
    await waitFor(() => expect(screen.getByTestId('room-table')).toBeInTheDocument());
  });

  it('shows add room modal when clicking add button', async () => {
    render(<RoomListPage />);
    const addBtn = screen.getByRole('button', { name: /thêm phòng/i });
    fireEvent.click(addBtn);
    expect(await screen.findByText(/thêm phòng mới/i)).toBeInTheDocument();
  });
}); 