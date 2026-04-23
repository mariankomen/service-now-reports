import React from 'react';
import './style.css';

type SpinnerSize = 'small' | 'medium' | 'large' | 'xlarge';

const SIZE_CONFIG: Record<SpinnerSize, { width: number; height: number; borderWidth: number }> = {
  small: { width: 14, height: 14, borderWidth: 2 },
  medium: { width: 18, height: 18, borderWidth: 2 },
  large: { width: 24, height: 24, borderWidth: 3 },
  xlarge: { width: 40, height: 40, borderWidth: 4 },
};

interface LoadingSpinnerProps {
  size?: SpinnerSize;
}

export default function LoadingSpinner({ size = 'small' }: LoadingSpinnerProps) {
  const config = SIZE_CONFIG[size];

  return (
    <span className="loading-spinner">
      <span
        className="spinner-circle"
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          borderWidth: `${config.borderWidth}px`,
        }}
      />
    </span>
  );
}