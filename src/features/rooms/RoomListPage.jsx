import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import CustomButton from '../../components/Button/CustomButton';
import AddRoomModal from './components/AddRoom/AddRoomModal';
import { queryRooms, deleteRoom, getRoomById } from './RoomAPI';
import RoomFilterBar from './components/RoomFilterBar/RoomFilterBar';
import RoomTable from './components/RoomTable/RoomTable';
import styles from './RoomListPage.module.scss';
// ...import các modal khác nếu có

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch room list from backend
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await queryRooms();
        setRooms(data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter rooms by search
  useEffect(() => {
    if (!search) {
      setFilteredRooms(rooms);
    } else {
      const lower = search.toLowerCase();
      setFilteredRooms(
        rooms.filter(r =>
          (r.roomNumber && r.roomNumber.toLowerCase().includes(lower)) ||
          (r.type && r.type.toLowerCase().includes(lower)) ||
          (r.description && r.description.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, rooms]);

  // Xoá phòng khỏi backend và cập nhật danh sách
  const handleDelete = async (id) => {
    const confirm = window.confirm('Bạn có chắc muốn xoá phòng này?');
    if (confirm) {
      try {
        await deleteRoom(id);
        setRooms(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xoá phòng.');
      }
    }
  };

  // Xem chi tiết phòng
  const handleViewDetail = async (id) => {
    setLoading(true);
    try {
      const room = await getRoomById(id);
      setSelectedRoom(room);
      setShowDetail(true);
    } catch (err) {
      alert('Không thể lấy thông tin phòng.');
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột cho bảng phòng
  const columns = [
    { header: 'Số phòng', accessor: 'roomNumber' },
    { header: 'Loại', accessor: 'type' },
    { header: 'Giá (VNĐ)', accessor: 'price' },
    { header: 'Sức chứa', accessor: 'capacity' },
    {
      header: 'Hành động',
      accessor: 'actions',
      cell: (row) => (
        <>
          <Button style={{background:'#00AEEF', border:'none', color:'#fff'}} size="sm" className="me-2" onClick={() => handleViewDetail(row._id)}>
            👁 Xem
          </Button>
          <Button style={{background:'#dc3545', border:'none', color:'#fff'}} size="sm" onClick={() => handleDelete(row._id)}>
            🗑 Xoá
          </Button>
        </>
      )
    }
  ];

  return (
    <Container className={styles.roomPageContainer}>
      <div className={styles.roomHeader}>
        <h2 className={styles.roomTitle}>Danh sách phòng</h2>
        <Button
          className={styles.addRoomBtn}
          style={{ background: '#00AEEF', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: '1rem', padding: '0.5rem 1.2rem', transition: 'background 0.2s' }}
          onClick={() => setShowModal(true)}
          onMouseOver={e => e.currentTarget.style.background = '#0095c8'}
          onMouseOut={e => e.currentTarget.style.background = '#00AEEF'}
        >
          + Thêm phòng
        </Button>
      </div>
      <RoomFilterBar search={search} setSearch={setSearch} />
      <RoomTable columns={columns} data={filteredRooms} loading={loading} />
      <AddRoomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        setRooms={setRooms}
      />
      {/* Các modal khác như RoomDetailModal nếu có */}
    </Container>
  );
};

export default RoomListPage;