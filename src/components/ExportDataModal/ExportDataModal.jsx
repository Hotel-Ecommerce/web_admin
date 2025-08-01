import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { FaDownload, FaFileCsv, FaFileExcel, FaTimes, FaCheck } from 'react-icons/fa';
import CloseModalButton from '../CloseModalButton/CloseModalButton';
import styles from './ExportDataModal.module.scss';

const ExportDataModal = ({ 
  show, 
  onHide, 
  data = [], 
  columns = [],
  defaultFileName = 'data',
  title = 'Xuất dữ liệu',
  showColumnSelection = true,
  showFormatSelection = true,
  showDateRange = false,
  onExport
}) => {
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.key || col.accessor));
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Export formats
  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: <FaFileCsv /> },
    { value: 'excel', label: 'Excel', icon: <FaFileExcel /> }
  ];

  // Handle column selection
  const handleColumnChange = (columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Handle select all columns
  const handleSelectAll = () => {
    const allColumns = columns.map(col => col.key || col.accessor);
    setSelectedColumns(allColumns);
  };

  // Handle deselect all columns
  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  // Export data
  const handleExport = async () => {
    if (!selectedColumns.length) {
      alert('Vui lòng chọn ít nhất một cột để xuất!');
      return;
    }

    setLoading(true);
    try {
      if (onExport) {
        // Use custom export function if provided
        await onExport({
          data,
          columns: selectedColumns,
          format: exportFormat,
          dateRange,
          fileName: `${defaultFileName}_${new Date().toISOString().split('T')[0]}`
        });
      } else {
        // Default export logic
        await exportData();
      }
      onHide();
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi xảy ra khi xuất dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  // Default export function
  const exportData = async () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else if (exportFormat === 'excel') {
      exportToExcel();
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = columns
      .filter(col => selectedColumns.includes(col.key || col.accessor))
      .map(col => col.header || col.label || col.key || col.accessor);

    const csvContent = [
      headers,
      ...data.map(row => 
        selectedColumns.map(colKey => {
          const column = columns.find(col => (col.key || col.accessor) === colKey);
          const value = row[colKey];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        })
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${defaultFileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      const headers = columns
        .filter(col => selectedColumns.includes(col.key || col.accessor))
        .map(col => col.header || col.label || col.key || col.accessor);

      const excelData = [
        headers,
        ...data.map(row => 
          selectedColumns.map(colKey => row[colKey])
        )
      ];

      const ws = XLSX.utils.aoa_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      
      XLSX.writeFile(wb, `${defaultFileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Không thể xuất file Excel. Vui lòng thử lại!');
    }
  };

  const getActiveColumnsCount = () => {
    return selectedColumns.length;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>
          <div className={styles.titleContent}>
            <FaDownload className={styles.exportIcon} />
            <span>{title}</span>
            {getActiveColumnsCount() > 0 && (
              <Badge bg="primary" className="ms-2">
                {getActiveColumnsCount()} cột
              </Badge>
            )}
          </div>
        </Modal.Title>
        <CloseModalButton onClick={onHide} />
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {/* Format Selection */}
        {showFormatSelection && (
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Định dạng xuất</Form.Label>
                <div className={styles.formatOptions}>
                  {exportFormats.map(format => (
                    <Form.Check
                      key={format.value}
                      type="radio"
                      id={`format-${format.value}`}
                      name="exportFormat"
                      label={
                        <div className={styles.formatOption}>
                          {format.icon}
                          <span>{format.label}</span>
                        </div>
                      }
                      checked={exportFormat === format.value}
                      onChange={() => setExportFormat(format.value)}
                      className={styles.formatCheck}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Date Range */}
        {showDateRange && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className={styles.formControl}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className={styles.formControl}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* Column Selection */}
        {showColumnSelection && (
          <Row>
            <Col md={12}>
              <div className={styles.columnSelection}>
                <div className={styles.columnHeader}>
                  <Form.Label>Chọn cột xuất</Form.Label>
                  <div className={styles.columnActions}>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={handleSelectAll}
                    >
                      <FaCheck /> Chọn tất cả
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={handleDeselectAll}
                    >
                      <FaTimes /> Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>
                <div className={styles.columnList}>
                  {columns.map((col, index) => {
                    const colKey = col.key || col.accessor;
                    const colLabel = col.header || col.label || colKey;
                    return (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        id={`col-${index}`}
                        label={colLabel}
                        checked={selectedColumns.includes(colKey)}
                        onChange={() => handleColumnChange(colKey)}
                        className={styles.columnCheck}
                      />
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Data Preview */}
        <Row className="mt-3">
          <Col md={12}>
            <div className={styles.dataPreview}>
              <Form.Label>Xem trước dữ liệu ({data.length} bản ghi)</Form.Label>
              <div className={styles.previewTable}>
                <table>
                  <thead>
                    <tr>
                      {columns
                        .filter(col => selectedColumns.includes(col.key || col.accessor))
                        .map((col, index) => (
                          <th key={index}>{col.header || col.label || col.key || col.accessor}</th>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns
                          .filter(col => selectedColumns.includes(col.key || col.accessor))
                          .map((col, colIndex) => {
                            const value = row[col.key || col.accessor];
                            return (
                              <td key={colIndex}>
                                {value === null || value === undefined ? '-' : String(value)}
                              </td>
                            );
                          })
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 5 && (
                  <div className={styles.previewNote}>
                    ... và {data.length - 5} bản ghi khác
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          ❌ Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={handleExport} 
          disabled={loading || !selectedColumns.length}
          className={styles.exportButton}
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" />
              Đang xuất...
            </>
          ) : (
            <>
              <FaDownload /> Xuất dữ liệu
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportDataModal; 