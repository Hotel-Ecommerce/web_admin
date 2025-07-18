import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import styles from './UpdateRoomModal.module.scss';
import { updateRoom } from '../../RoomAPI';
import CloseModalButton from '../../../../components/CloseModalButton/CloseModalButton';

const UpdateRoomModal = ({ show, onHide, room, setRooms }) => {
  const [form, setForm] = useState({
    roomNumber: '',
    type: '',
    price: '',
    description: '',
    capacity: '',
    status: '',
  });
  const [images, setImages] = useState([]); // new images (File[])
  const [existingImages, setExistingImages] = useState([]); // urls
  const [removedImageUrls, setRemovedImageUrls] = useState([]); // urls to remove
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setForm({
        roomNumber: room.roomNumber || '',
        type: room.type || '',
        price: room.price || '',
        description: room.description || '',
        capacity: room.capacity || '',
        status: room.status || '',
      });
      setExistingImages(room.images || []);
      setImages([]);
      setRemovedImageUrls([]);
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (url) => {
    setRemovedImageUrls(prev => [...prev, url]);
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', room._id);
      formData.append('roomNumber', form.roomNumber);
      formData.append('type', form.type);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('capacity', form.capacity);
      formData.append('status', form.status);
      images.forEach((file) => formData.append('images', file));
      removedImageUrls.forEach((url) => formData.append('removedImageUrls', url));
      const updatedRoom = await updateRoom(formData);
      setSuccess('Cập nhật phòng thành công!');
      setRooms(prev => prev.map(r => r._id === room._id ? updatedRoom : r));
      setTimeout(() => {
        setSuccess('');
        onHide();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật phòng.');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  return (
    <Modal show={show} onHide={onHide} centered className={styles['update-room-modal']}>
      <Modal.Header>
        <Modal.Title>Cập nhật phòng</Modal.Title>
        <CloseModalButton onClick={onHide} />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Số phòng</Form.Label>
            <Form.Control
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
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá (VNĐ)</Form.Label>
            <Form.Control
              name="price"
              type="number"
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
            <Form.Label>Số lượng người tối đa</Form.Label>
            <Form.Control
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              required
              min={1}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="Trống">Trống</option>
              <option value="Đã đặt">Đã đặt</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh hiện tại</Form.Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {existingImages && existingImages.length > 0 ? (
                existingImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                    <Image src={img} thumbnail style={{ width: 80, height: 80, objectFit: 'cover' }} />
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ position: 'absolute', top: 0, right: 0, padding: '0 6px' }}
                      onClick={() => handleRemoveExistingImage(img)}
                    >
                      ×
                    </Button>
                  </div>
                ))
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thêm hình ảnh mới</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleImageChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>Huỷ</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateRoomModal;
