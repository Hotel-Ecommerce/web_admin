import React from 'react';
import styles from './TableWrapper.module.scss';
import { Table } from 'react-bootstrap';

const TableWrapper = ({ columns, data }) => {
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
                <td key={colIndex}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableWrapper;