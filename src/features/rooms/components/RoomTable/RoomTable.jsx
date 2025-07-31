import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import TableWrapper from '../../../../components/TableWrapper/TableWrapper';
import styles from './RoomTable.module.scss';

const RoomTable = ({ columns, data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(
          <Pagination.Item
            key={1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      } else {
        // Middle
        pages.push(
          <Pagination.Item
            key={1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis3" />);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis4" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }
    
    return pages;
  };

  return (
    <div className={styles.roomTable}>
      <TableWrapper 
        columns={columns} 
        data={currentItems.map((item, index) => ({
          ...item,
          _paginationIndex: indexOfFirstItem + index
        }))} 
        loading={loading} 
      />
      
      {/* Pagination */}
      {!loading && data.length > 0 && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)} trong tổng số {data.length} phòng
          </div>
          <Pagination className={styles.pagination}>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {renderPageNumbers()}
            
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default RoomTable; 