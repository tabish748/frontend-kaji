import React from 'react';
import styles from "../../styles/components/atoms/input.module.scss";

interface HeadingRowProps {
  headingTitle: string;
  tag?: any;
}

const HeadingRow: React.FC<HeadingRowProps> = ({ headingTitle, tag }) => {

  const getTagClass = (tagValue: string) => {
    switch (tagValue) {
      case 'firstTime':
        return 'tagFirstTime';
      case 'inherit':
        return 'tagInherit';
      case 'required':
        return 'tagRequired';
      default:
        return 'tagDefault'; // Default class for simple text tags
    }
  };

  // Render function for tags
  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span key={index} className={`${styles.tag} ${getTagClass(item.value)}`}>
          {item.label}
        </span>
      ));
    } else if (typeof tag === 'string') {
      // Render a simple text tag with a default red color
      return <span className={`${styles.tag} ${styles.tagDefault}`}>{tag}</span>;
    }
    return null;
  };

  return (
    <div style={{ width: '100%', color: '#3e79f7', backgroundColor: 'rgba(62, 121, 247, 0.1)', padding: '.8rem', borderRadius: '5px', fontSize: '14px', display: 'flex' }}>
      <b>{headingTitle}</b>
      {renderTags()}
    </div>
  );
};

export default HeadingRow;