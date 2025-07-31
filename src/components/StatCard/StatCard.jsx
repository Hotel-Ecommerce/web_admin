import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './StatCard.module.scss';

const StatCard = ({ 
  title,
  value,
  icon,
  color = '#00AEEF',
  trend = null,
  trendValue = null,
  trendDirection = 'up', // 'up', 'down', 'neutral'
  size = 'md',
  className = '',
  onClick = null
}) => {
  const getTrendIcon = () => {
    if (trendDirection === 'up') return '📈';
    if (trendDirection === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return '#28a745';
    if (trendDirection === 'down') return '#dc3545';
    return '#6c757d';
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const cardContent = (
    <Card.Body className={styles.cardBody}>
      <div className={styles.cardHeader}>
        <div 
          className={styles.iconContainer}
          style={{ 
            '--icon-color': color
          }}
        >
          {icon}
        </div>
        {trend && (
          <div 
            className={styles.trendIndicator}
            style={{ color: getTrendColor() }}
          >
            {getTrendIcon()} {trendValue}%
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.value}>
          {formatValue(value)}
        </div>
        <div className={styles.title}>
          {title}
        </div>
      </div>
    </Card.Body>
  );

  return (
    <Card 
      className={`${styles.statCard} ${styles[size]} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {onClick ? (
        <div className={styles.clickableWrapper}>
          {cardContent}
        </div>
      ) : (
        cardContent
      )}
    </Card>
  );
};

export default StatCard; 