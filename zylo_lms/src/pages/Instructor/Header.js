// pages/Instructor/Header.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPalette } from 'react-icons/fa';
import { BsSun } from 'react-icons/bs';

const Header = ({ onToggleDarkMode, onChangeTheme }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid #ddd',
        height: '60px',
      }}
    >
      {/* Left side: Role label */}
      <h6 className="mb-0 fw-semibold" style={{ color: 'var(--text-color)' }}>
        Trainer
      </h6>

      {/* Right side: Buttons and icons */}
      <div className="d-flex align-items-center gap-2">
        <Button variant="outline-primary" size="sm">
          Review Issue
        </Button>
        <Button variant="outline-primary" size="sm">
          AI
        </Button>
        <span
          role="button"
          onClick={onToggleDarkMode}
          style={{ cursor: 'pointer', fontSize: '18px' }}
        >
          <BsSun color="#f39c12" />
        </span>
        <span
          role="button"
          onClick={onChangeTheme}
          style={{ cursor: 'pointer', fontSize: '18px' }}
        >
          <FaPalette color="#2980b9" />
        </span>
      </div>
    </div>
  );
};

export default Header;
