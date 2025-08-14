import React from 'react';

interface ColabIconProps {
  className?: string;
}

export const ColabIcon: React.FC<ColabIconProps> = ({
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      viewBox='0 0 24 24'
      className={className}
      style={
        {
          '--colab-logo-dark': 'currentColor',
          '--colab-logo-light': 'currentColor',
        } as React.CSSProperties
      }
    >
      <g id='colab-logo'>
        <path
          d='M4.54,9.46,2.19,7.1a6.93,6.93,0,0,0,0,9.79l2.36-2.36A3.59,3.59,0,0,1,4.54,9.46Z'
          style={{ fill: 'var(--colab-logo-dark)' }}
        ></path>
        <path
          d='M2.19,7.1,4.54,9.46a3.59,3.59,0,0,1,5.08,0l1.71-2.93h0l-.1-.08h0A6.93,6.93,0,0,0,2.19,7.1Z'
          style={{ fill: 'var(--colab-logo-light)' }}
        ></path>
        <path
          d='M11.34,17.46h0L9.62,14.54a3.59,3.59,0,0,1-5.08,0L2.19,16.9a6.93,6.93,0,0,0,9,.65l.11-.09'
          style={{ fill: 'var(--colab-logo-light)' }}
        ></path>
        <path
          d='M12,7.1a6.93,6.93,0,0,0,0,9.79l2.36-2.36a3.59,3.59,0,1,1,5.08-5.08L21.81,7.1A6.93,6.93,0,0,0,12,7.1Z'
          style={{ fill: 'var(--colab-logo-light)' }}
        ></path>
        <path
          d='M21.81,7.1,19.46,9.46a3.59,3.59,0,0,1-5.08,5.08L12,16.9A6.93,6.93,0,0,0,21.81,7.1Z'
          style={{ fill: 'var(--colab-logo-dark)' }}
        ></path>
      </g>
    </svg>
  );
};
