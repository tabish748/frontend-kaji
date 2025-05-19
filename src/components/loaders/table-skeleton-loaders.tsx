import React from 'react';
import styles from '../../styles/loaders/table-skeleton-loader.module.scss';

const SkeletonTable: React.FC = () => {
  return (
    <div className={styles.skeletonTableWrapper}>
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <div className={styles.skeletonCell}></div>
          {/* Add more cells if needed */}
        </div>
      ))}
    </div>
    
  );
};

export default SkeletonTable;
