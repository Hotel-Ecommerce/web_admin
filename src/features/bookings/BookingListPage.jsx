import React, { useState, useContext } from 'react';
import BookingList from './components/BookingList/BookingList';
import AddBookingModal from './components/AddBookingModal/AddBookingModal';
import UpdateBookingModal from './components/UpdateBookingModal/UpdateBookingModal';
import DeleteBookingModal from './components/DeleteBookingModal/DeleteBookingModal';
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal';
import BookingFilterBar from './components/BookingFilterBar/BookingFilterBar';
import { UserContext } from '../../context/UserContext';
import styles from './BookingListPage.module.scss';
import { FaPlusCircle, FaFilter } from 'react-icons/fa';
import BookingFilterModal from './components/BookingFilterModal/BookingFilterModal';

const BookingListPage = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const handleReload = () => setReload(r => !r);

  return (
    <div className={styles.bookingPage}>
      <div className={styles.header}>
        <h1>Quản lý đặt phòng</h1>
        <div style={{display:'flex',gap:8}}>
          <button className={styles.addBtn} title="Thêm booking" onClick={() => setShowAdd(true)}>
            <FaPlusCircle size={28} style={{color:'#43a047'}} />
          </button>
          <button className={styles.addBtn} title="Lọc booking" onClick={() => setShowFilter(true)}>
            <FaFilter size={24} style={{color:'#1976d2'}} />
          </button>
        </div>
      </div>
      <BookingFilterModal show={showFilter} onClose={() => setShowFilter(false)} filter={filter} setFilter={setFilter} />
      <BookingList
        token={token}
        reload={reload}
        filter={filter}
        onEdit={booking => { setSelectedBooking(booking); setShowUpdate(true); }}
        onDelete={booking => { setSelectedBooking(booking); setShowDelete(true); }}
        onDetail={booking => { setSelectedBooking(booking); setShowDetail(true); }}
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
    </div>
  );
};

export default BookingListPage; 