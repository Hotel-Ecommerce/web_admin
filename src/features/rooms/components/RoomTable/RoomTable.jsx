import React from 'react';
import TableWrapper from '../../../../components/TableWrapper/TableWrapper';
import styles from './RoomTable.module.scss';

const RoomTable = ({ columns, data, loading }) => (
  <div className={styles.roomTable}>
    <TableWrapper columns={columns} data={data} loading={loading} />
  </div>
);

export default RoomTable; 