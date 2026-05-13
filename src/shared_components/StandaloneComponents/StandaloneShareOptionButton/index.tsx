import React from 'react';
import './styles.css';

interface StandaloneShareOptionButtonProps {
  icon: React.ReactNode | React.ComponentType<any>;
  label: string;
  onClick: () => void;
  selected?: boolean;
  className?: string;
}

export const StandaloneShareOptionButton: React.FC<StandaloneShareOptionButtonProps> = ({
  icon,
  label,
  onClick,
  selected = false,
  className = '',
}) => {
  const renderIcon = () => {
    // If icon is a React component (function/class), render it
    if (typeof icon === 'function') {
      return React.createElement(icon);
    }
    // If icon is already a React element, just return it
    return icon;
  };

  return (
    <button
      className={`share-option-button ${selected ? 'share-option-button--selected' : ''} ${className}`}
      onClick={onClick}
      type="button"
    >
      <div className={`share-option-icon ${selected ? 'share-option-icon--selected' : ''}`}>
        {renderIcon()}
      </div>
      <span className="share-option-label">{label}</span>
    </button>
  );
};

export default StandaloneShareOptionButton;
