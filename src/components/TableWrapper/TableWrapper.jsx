import React from 'react';
import styles from './TableWrapper.module.scss';
import { Table } from 'react-bootstrap';

const TableWrapper = ({ columns, data, loading }) => {
  console.log('TableWrapper received:', { columns: columns.length, data: data.length, loading });
  
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Không có dữ liệu phòng nào.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.wrapper}>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableWrapper;