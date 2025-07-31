import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';
import styles from './AddRoomModal.module.scss';
import { addRoom } from '../../RoomAPI';

const AddRoomModal = ({ show, onHide, setRooms, onSuccess, onError }) => {
  const [form, setForm] = useState({
    roomNumber: '',
    type: '',
    price: '',
    description: '',
    capacity: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!form.roomNumber || !form.type || !form.price || !form.capacity || images.length === 0) {
      setError('Vui lòng điền đầy đủ thông tin và chọn ít nhất một hình ảnh.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('roomNumber', form.roomNumber);
    formData.append('type', form.type);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('capacity', form.capacity);
    images.forEach((file) => formData.append('images', file));
    try {
      const newRoom = await addRoom(formData);
      setSuccess('Thêm phòng thành công!');
      setRooms(prev => [...prev, newRoom]);
      setForm({ roomNumber: '', type: '', price: '', description: '', capacity: '' });
      setImages([]);
      
      // Call success callback
      if (onSuccess) {
        onSuccess('Thêm phòng thành công!');
      }
      
      setTimeout(() => {
        setSuccess('');
        onHide();
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi thêm phòng.';
      setError(errorMessage);
      
      // Call error callback
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setForm({ roomNumber: '', type: '', price: '', description: '', capacity: '' });
    setImages([]);
    onHide();
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
    setForm({ roomNumber: '', type: '', price: '', description: '', capacity: '' });
    setImages([]);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className={styles['add-room-modal']}>
      <Modal.Header>
        <Modal.Title>Thêm phòng mới</Modal.Title>
        <CloseModalButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Số phòng</Form.Label>
            <Form.Control
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại phòng</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Chọn loại phòng</option>
              <option value="Standard">Tiêu chuẩn</option>
              <option value="Deluxe">Cao cấp</option>
              <option value="Suite">Hạng sang</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá (VNĐ)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng người tối đa</Form.Label>
            <Form.Select
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            >
              <option value="">Chọn số lượng người</option>
              <option value="1">1 người</option>
              <option value="2">2 người</option>
              <option value="3">3 người</option>
              <option value="4">4 người</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={loading}>Huỷ</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRoomModal;
