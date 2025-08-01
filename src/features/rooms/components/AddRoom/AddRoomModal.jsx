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
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Chỉ chấp nhận file ảnh: JPG, PNG, WEBP');
      return;
    }
    
    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }
    
    // Validate total number of files (max 5 images)
    if (files.length > 5) {
      setError('Tối đa chỉ được chọn 5 hình ảnh');
      return;
    }
    
    setImages(files);
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    // Validation
    if (!form.roomNumber || !form.type || !form.price || !form.capacity) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    
    if (images.length === 0) {
      setError('Vui lòng chọn ít nhất một hình ảnh cho phòng.');
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
      <Modal.Header closeButton>
        <Modal.Title>Thêm phòng mới</Modal.Title>
        <CloseModalButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Số phòng *</Form.Label>
            <Form.Control
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại phòng *</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Chọn loại phòng</option>
              <option value="Standard">Tiêu chuẩn</option>
              <option value="Deluxe">Cao cấp</option>
              <option value="Suite">Hạng sang</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá (VNĐ) *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
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
            <Form.Label>Số lượng người tối đa *</Form.Label>
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
            <Form.Label>Hình ảnh *</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <Form.Text className="text-muted">
              Chấp nhận: JPG, PNG, WEBP. Tối đa 5MB mỗi file, tối đa 5 hình ảnh.
            </Form.Text>
            {images.length > 0 && (
              <div className="mt-2">
                <small className="text-success">
                  Đã chọn {images.length} hình ảnh
                </small>
              </div>
            )}
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
