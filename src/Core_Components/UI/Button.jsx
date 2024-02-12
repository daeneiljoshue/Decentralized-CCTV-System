import React from 'react';

const Button = ({ children, type = 'button', onClick, disabled = false, className = '', ...otherProps }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
