import React from 'react';
import './styles.css';

interface StandaloneInspirationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  inspirationTitle?: string;
  inspirationCategory?: string;
}

export const StandaloneInspirationPopover: React.FC<StandaloneInspirationPopoverProps> = ({
  isOpen,
  onClose,
  inspirationTitle,
  inspirationCategory,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="popover-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="popover-modal">
        {/* Close button - outside container */}
        <button className="close-button" onClick={onClose} aria-label="Close popover">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="popover-container">
          {/* Header with image and title */}
          <div className="popover-header">
            <div className="image-container">
              <div className="image-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#E5E7EB" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="#9CA3AF" />
                  <path d="M21 15l-5-5L5 21l5-5" stroke="#9CA3AF" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <h1 className="inspiration-title">
              {inspirationTitle || 'Retro-themed pub poster for young adults'}
            </h1>
          </div>

          {/* Content */}
          <div className="popover-content">
            {/* Details section */}
            <div className="details-container">
              <div className="section">
                <h2 className="section-header">About</h2>
                <p className="description">
                  Hospitality businesses thrive on creating memorable experiences through compelling
                  visual storytelling. Your design should capture the unique atmosphere and
                  personality of the venue, making potential customers feel excited to visit and
                  experience what you offer.
                </p>
              </div>

              <div className="section">
                <h2 className="section-header">Design and Content Tips</h2>
                <div className="tips-list">
                  <div className="tip-item">
                    • Use warm, inviting colors that reflect the venue's ambiance and target
                    audience
                  </div>
                  <div className="tip-item">
                    • Incorporate high-quality food and atmosphere photography to showcase the
                    experience
                  </div>
                  <div className="tip-item">
                    • Choose typography that matches the venue's personality - elegant for fine
                    dining, casual for pubs
                  </div>
                  <div className="tip-item">
                    • Highlight unique selling points like signature dishes, events, or special
                    offers
                  </div>
                  <div className="tip-item">
                    • Include practical information like opening hours, location, and contact
                    details
                  </div>
                </div>
              </div>
            </div>

            {/* Key Details sidebar */}
            <div className="key-details">
              <h2 className="key-details-title">Key Details</h2>

              <button
                className="create-button"
                onClick={() => {
                  console.log('Creating design for:', inspirationTitle);
                  onClose();
                }}
              >
                Create
              </button>
            </div>
          </div>

          {/* Bottom placeholder area */}
          <div className="bottom-placeholder">
            <div className="placeholder-box">
              <span className="placeholder-text">Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StandaloneInspirationPopover;
