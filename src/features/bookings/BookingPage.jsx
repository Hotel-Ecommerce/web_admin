import React, { useState, useContext } from 'react';
import BookingList from './components/BookingList/BookingList';
import AddBookingModal from './components/AddBookingModal/AddBookingModal';
import UpdateBookingModal from './components/UpdateBookingModal/UpdateBookingModal';
import DeleteBookingModal from './components/DeleteBookingModal/DeleteBookingModal';
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal';
import RequestBookingChangeModal from './components/RequestBookingChangeModal/RequestBookingChangeModal';
import { UserContext } from '../../context/UserContext';
import { markBookingPaid } from './BookingAPI';
import styles from './BookingListPage.module.scss';
import { FaPlusCircle, FaFilter, FaExchangeAlt } from 'react-icons/fa';

const BookingPage = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showRequestChange, setShowRequestChange] = useState(false);
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload(r => !r);

  const handleMarkPaid = async (booking) => {
    try {
      await markBookingPaid(booking._id, token);
      alert('Đã đánh dấu thanh toán thành công!');
      handleReload();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.bookingPage}>
      <div className={styles.header}>
        <h1>Quản lý đặt phòng</h1>
        <div style={{display:'flex',gap:8}}>
          <button className={styles.addBtn} title="Thêm booking" onClick={() => setShowAdd(true)}>
            <FaPlusCircle size={28} style={{color:'#43a047'}} />
          </button>
          <button className={styles.addBtn} title="Lọc booking" onClick={() => {}}>
            <FaFilter size={24} style={{color:'#1976d2'}} />
          </button>
        </div>
      </div>
      <BookingList
        token={token}
        reload={reload}
        onEdit={booking => { setSelectedBooking(booking); setShowUpdate(true); }}
        onDelete={booking => { setSelectedBooking(booking); setShowDelete(true); }}
        onDetail={booking => { setSelectedBooking(booking); setShowDetail(true); }}
        onRequestChange={booking => { setSelectedBooking(booking); setShowRequestChange(true); }}
        onMarkPaid={handleMarkPaid}
      />
      <AddBookingModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        token={token}
        onAdded={handleReload}
      />
      <UpdateBookingModal
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        booking={selectedBooking}
        token={token}
        onUpdated={handleReload}
      />
      <DeleteBookingModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        booking={selectedBooking}
        token={token}
        onDeleted={handleReload}
      />
      <BookingDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        booking={selectedBooking}
      />
      <RequestBookingChangeModal
        isOpen={showRequestChange}
        onClose={() => setShowRequestChange(false)}
        booking={selectedBooking}
        onSuccess={handleReload}
      />
    </div>
  );
};

export default BookingPage; 