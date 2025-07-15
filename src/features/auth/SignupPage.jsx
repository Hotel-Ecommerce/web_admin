import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { signup } from './AuthAPI';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signup(form);
      setSuccess('Đăng ký thành công! Chuyển về trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Row>
        <Col>
          <Card style={{ width: '24rem' }}>
            <Card.Body>
              <h2 className="text-center mb-4">Đăng ký</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Nhập họ tên"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100" variant="primary" disabled={loading}>
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
                <div className="mt-3 text-center">
                  <span>Bạn đã có tài khoản? </span>
                  <Button variant="link" onClick={() => navigate('/login')}>Đăng nhập</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage; 