import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

interface StandaloneShareMenuProps {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  visitorCount?: number;
  currentUser?: {
    name?: string;
    avatar?: string;
  };
}

export const StandaloneShareMenu: React.FC<StandaloneShareMenuProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
  visitorCount = 0,
  currentUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [accessLevel, setAccessLevel] = useState('only-you');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const actualIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  const accessOptions = [
    {
      value: 'only-you',
      label: 'Only you can access',
      description: 'Only you can access the design using this link.',
      icon: 'lock',
    },
    {
      value: 'team',
      label: 'Team',
      description: 'Anyone from your team can access the design using this link.',
      icon: 'team',
    },
    {
      value: 'anyone-with-link',
      label: 'Anyone with the link',
      description: 'Anyone can access the design using this link. No sign in required.',
      icon: 'globe',
    },
  ];

  const selectedOption =
    accessOptions.find(option => option.value === accessLevel) || accessOptions[0];

  const handleToggle = () => {
    const newState = !actualIsOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setIsOpen(newState);
    }
  };

  const handleCopyLink = () => {
    console.log('Copy link clicked');
    // You can implement actual clipboard functionality here
    navigator.clipboard?.writeText(window.location.href);
  };

  const handleAccessLevelChange = (value: string) => {
    setAccessLevel(value);
    setIsDropdownOpen(false);
  };

  const handleAction = (action: string) => {
    console.log(`Share menu action: ${action}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current
        && !menuRef.current.contains(event.target as Node)
        && buttonRef.current
        && !buttonRef.current.contains(event.target as Node)
      ) {
        if (onToggle) {
          onToggle(false);
        } else {
          setIsOpen(false);
        }
        setIsDropdownOpen(false);
      }
    };

    if (actualIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actualIsOpen, onToggle]);

  // Render icon based on type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'lock':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
      case 'team':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        );
      case 'globe':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="share-menu-wrapper">
      {/* Share Button */}
      <button
        ref={buttonRef}
        className="share-button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={actualIsOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>Share</span>
      </button>

      {/* Flyout Menu */}
      {actualIsOpen && (
        <div ref={menuRef} className="share-menu-panel">
          <div className="share-menu-content">
            {/* Header */}
            <div className="header-section">
              <div className="header-row">
                <h2 className="panel-title">Share design</h2>
                <div className="header-actions">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 20V10"></path>
                    <path d="M12 20V4"></path>
                    <path d="M6 20v-6"></path>
                  </svg>
                  <span className="visitor-count">{visitorCount} visitors</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* People with access */}
            <div className="menu-section">
              <h3 className="section-title">People with access</h3>
              <div className="search-input-container">
                <svg
                  className="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Add people or groups"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
              </div>
              <div className="avatar-section">
                <div className="avatar-container">
                  <div className="avatar">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name || 'User'} />
                    ) : (
                      <div className="avatar-placeholder">
                        {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <button className="add-person-button">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Access level */}
            <div className="menu-section">
              <h3 className="section-title">Access level</h3>
              <div className="custom-dropdown">
                <button
                  className="dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="dropdown-trigger-content">
                    <div className="dropdown-icon">{renderIcon(selectedOption.icon)}</div>
                    <span className="dropdown-label">{selectedOption.label}</span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`chevron ${isDropdownOpen ? 'chevron-up' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {accessOptions.map(option => (
                      <button
                        key={option.value}
                        className={`dropdown-option ${option.value === accessLevel ? 'selected-option' : ''}`}
                        onClick={() => handleAccessLevelChange(option.value)}
                      >
                        <div className="option-icon">{renderIcon(option.icon)}</div>
                        <div className="option-content">
                          <div className="option-label">{option.label}</div>
                          <div className="option-description">{option.description}</div>
                        </div>
                        {option.value === accessLevel && (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Copy link button */}
            <div className="menu-section">
              <button className="copy-link-button" onClick={handleCopyLink}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Copy link</span>
              </button>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Action buttons grid */}
            <div className="menu-section">
              <div className="action-grid">
                <button className="action-item" onClick={() => handleAction('download')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                  <span className="action-label">Download</span>
                </button>

                <button className="action-item" onClick={() => handleAction('present')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <span className="action-label">Present</span>
                </button>

                <button className="action-item" onClick={() => handleAction('request-approval')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="action-label">Request approval</span>
                </button>

                <button className="action-item" onClick={() => handleAction('view-only-link')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                  <span className="action-label">View-only link</span>
                </button>

                <button className="action-item" onClick={() => handleAction('print-with-canva')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </div>
                  <span className="action-label">Print with Canva</span>
                </button>

                <button className="action-item" onClick={() => handleAction('present-and-record')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                  <span className="action-label">Present and record</span>
                </button>

                <button className="action-item" onClick={() => handleAction('website')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <span className="action-label">Website</span>
                </button>

                <button className="action-item" onClick={() => handleAction('see-all')}>
                  <div className="action-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </div>
                  <span className="action-label">See all</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneShareMenu;
