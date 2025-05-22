import React from "react";
import Image from "next/image";
import styles from "../../styles/components/atoms/image-label.module.scss";

interface ImageLabelProps {
  iconSrc: string;
  label: string;
  onClick?: () => void;
  className?: string;
  iconAlt?: string;
}

const ImageLabel: React.FC<ImageLabelProps> = ({
  iconSrc,
  label,
  onClick,
  className = "",
  iconAlt = "icon",
}) => (
  <button className={`${styles.imageLabelButton} ${className}`} onClick={onClick}>
    <Image src={iconSrc} alt={iconAlt} width={20} height={20} className={styles.imageLabelIcon} />
    <span className={styles.imageLabelText}>{label}</span>
  </button>
);

export default ImageLabel;
