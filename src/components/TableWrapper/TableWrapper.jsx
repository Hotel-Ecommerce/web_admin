import React from 'react';
import styles from './TableWrapper.module.scss';
import { Table, Spinner } from 'react-bootstrap';
import { FaSearch, FaInbox } from 'react-icons/fa';

const TableWrapper = ({ columns, data, loading, emptyMessage = "Không có dữ liệu nào.", loadingMessage = "Đang tải dữ liệu..." }) => {
  console.log('TableWrapper received:', { columns: columns.length, data: data.length, loading });
  
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">{loadingMessage}</p>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f8f9fa',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            color: '#6c757d'
          }}>
            <FaInbox />
          </div>
          <h5 style={{ color: '#495057', marginBottom: '0.5rem' }}>Không có dữ liệu</h5>
          <p className="text-muted mb-0">{emptyMessage}</p>
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
              <th key={index} style={{ 
                background: '#f8f9fa', 
                borderColor: '#dee2e6',
                fontWeight: '600',
                color: '#495057'
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ 
              transition: 'background-color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ 
                  borderColor: '#dee2e6',
                  verticalAlign: 'middle'
                }}>
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