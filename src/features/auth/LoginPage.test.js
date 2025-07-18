import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { UserProvider } from '../../context/UserContext';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({})
}));

// Mock API
jest.mock('./AuthAPI', () => ({
  login: jest.fn((email, password) => {
    if (email === 'admin@email.com' && password === '123456') {
      return Promise.resolve({
        token: 'fake-token',
        user: { _id: '1', fullName: 'Admin', role: 'Admin', email: 'admin@email.com' }
      });
    } else {
      return Promise.reject({ response: { data: { message: 'Đăng nhập thất bại!' } } });
    }
  })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('login success and set user/token', async () => {
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    );
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    await waitFor(() => expect(localStorage.getItem('token')).toBe('fake-token'));
    expect(JSON.parse(localStorage.getItem('user')).fullName).toBe('Admin');
  });

  it('login fail shows error', async () => {
    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    );
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), { target: { value: 'wrong@email.com' } });
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    expect(await screen.findByText(/đăng nhập thất bại/i)).toBeInTheDocument();
  });
}); 