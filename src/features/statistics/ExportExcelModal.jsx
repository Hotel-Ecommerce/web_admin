import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './ExportExcelModal.module.scss';

const getAllColumns = (data) => {
  if (!data || !data.length) return [];
  return Object.keys(data[0]);
};

const ExportExcelModal = ({ show, onClose, data = [], defaultFileName = 'thong_ke.xlsx' }) => {
  const columns = getAllColumns(data);
  const [selectedCols, setSelectedCols] = useState(columns);

  const handleColChange = (col) => {
    setSelectedCols((prev) =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleExport = () => {
    if (!selectedCols.length) return;
    const exportData = data.map(row => {
      const obj = {};
      selectedCols.forEach(col => { obj[col] = row[col]; });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Thống kê');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, defaultFileName);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xuất Excel thống kê</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.exportDesc}>Chọn các cột muốn xuất:</div>
        <Form>
          {columns.map(col => (
            <Form.Check
              key={col}
              type="checkbox"
              label={col}
              checked={selectedCols.includes(col)}
              onChange={() => handleColChange(col)}
              className={styles.exportCheckbox}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button variant="success" onClick={handleExport} disabled={!selectedCols.length}>Export</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportExcelModal; 