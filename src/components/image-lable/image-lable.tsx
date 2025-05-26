import React from "react";
import Image from "next/image";
import styles from "../../styles/components/atoms/image-label.module.scss";

interface ImageLabelProps {
  iconSrc?: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  iconAlt?: string;
}

const ImageLabel: React.FC<ImageLabelProps> = ({
  iconSrc,
  icon,
  label,
  onClick,
  className = "",
  iconAlt = "icon",
}) => (
  <button className={`${styles.imageLabelButton} ${className}`} onClick={onClick}>
    <span className={styles.imageLabelIcon}>      {icon || (iconSrc && (
        <Image src={iconSrc} alt={iconAlt} width={20} height={20} />
      ))}
    </span>
    <span className={styles.imageLabelText}>{label}</span>
  </button>
);

export default ImageLabel;
