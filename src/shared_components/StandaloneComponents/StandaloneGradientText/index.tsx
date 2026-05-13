import React from 'react';
import './styles.css';

interface StandaloneGradientTextProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'default' | 'mobile';
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export const StandaloneGradientText: React.FC<StandaloneGradientTextProps> = ({
  children,
  size = 'xlarge',
  variant = 'default',
  tagName = 'h1',
  alignment = 'center',
  className = '',
}) => {
  const Tag = tagName;

  const classes = [
    'gradient-text',
    `gradient-text--${size}`,
    `gradient-text--${alignment}`,
    variant === 'mobile' ? 'gradient-text--mobile' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
};

export default StandaloneGradientText;
