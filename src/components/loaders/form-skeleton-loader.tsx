import React from 'react';
import styles from '../../styles/loaders/form-skeleton-loader.module.scss';

const SkeletonForm: React.FC = () => {
    return (
        <div className={styles.skeletonFormWrapper}>
            {Array(1).fill(null).map((_, rowIndex) => (
                <div key={rowIndex} className={styles.skeletonRow}>
                    <div className={styles.skeletonField}></div>
                    <div className={styles.skeletonField}></div>
                </div>
            ))}
            <div className={styles.skeletonButton}></div>
        </div>
    );
};

export default SkeletonForm;
