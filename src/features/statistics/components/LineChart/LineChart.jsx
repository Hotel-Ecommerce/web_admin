import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './LineChart.module.scss';

const LineChart = ({ title, data, height = 300 }) => {
  return (
    <Card className={styles.lineChartCard}>
      <Card.Header>
        <h6 className={styles.chartTitle}>{title}</h6>
      </Card.Header>
      <Card.Body>
        <div className={styles.chartContainer} style={{ height }}>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartIcon}>📈</div>
            <h6>Biểu đồ đường</h6>
            <p>{title}</p>
            <div className={styles.chartLegend}>
              {data?.datasets?.map((dataset, index) => (
                <div key={index} className={styles.legendItem}>
                  <span 
                    className={styles.legendColor} 
                    style={{ backgroundColor: dataset.borderColor }}
                  />
                  <span className={styles.legendLabel}>{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LineChart; 