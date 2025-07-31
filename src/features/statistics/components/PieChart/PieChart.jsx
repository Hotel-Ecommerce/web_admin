import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './PieChart.module.scss';

const PieChart = ({ title, data, height = 300 }) => {
  return (
    <Card className={styles.pieChartCard}>
      <Card.Header>
        <h6 className={styles.chartTitle}>{title}</h6>
      </Card.Header>
      <Card.Body>
        <div className={styles.chartContainer} style={{ height }}>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartIcon}>🥧</div>
            <h6>Biểu đồ tròn</h6>
            <p>{title}</p>
            <div className={styles.chartLegend}>
              {data?.labels?.map((label, index) => (
                <div key={index} className={styles.legendItem}>
                  <span 
                    className={styles.legendColor} 
                    style={{ 
                      backgroundColor: data.datasets[0]?.backgroundColor?.[index] || '#ccc' 
                    }}
                  />
                  <span className={styles.legendLabel}>{label}</span>
                  <span className={styles.legendValue}>
                    {data.datasets[0]?.data?.[index] || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PieChart; 