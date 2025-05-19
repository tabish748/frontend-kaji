import React from 'react';
import styles from '../../styles/components/molecules/tabs.module.scss';
import Image from 'next/image';
import Button from '../button/button';

type TabProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

const Tab: React.FC<TabProps> = ({ isActive, label, onClick }) => {
  return (
    <Button
      text={label}
      type={isActive ? 'primary' : 'secondary'} 
      size="medium"
      fullWidth={true}
      onClick={onClick}
      className={styles.tabBtn}
    />
  );
};

export default Tab;
