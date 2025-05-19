// FullscreenLoader.tsx

import React from 'react';
import styles from '../../styles/components/molecules/loader.module.scss';

const FullscreenLoader: React.FC = () => {
  return (
    <div className={styles.fullscreenLoader}>
      <div className={styles.cogwheel}></div>
    </div>
  );
}

export default FullscreenLoader;
