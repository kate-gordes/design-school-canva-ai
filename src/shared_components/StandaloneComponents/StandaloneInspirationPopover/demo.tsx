import React, { useState } from 'react';
import StandaloneInspirationPopover from './index';

// Demo component showing how to use the standalone popover
export const StandaloneInspirationPopoverDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Standalone Inspiration Popover Demo</h1>
      <p>This component has no dependencies on Easel or any other UI library.</p>

      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        Open Inspiration Popover
      </button>

      <StandaloneInspirationPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inspirationTitle="Retro-themed pub poster for young adults"
        inspirationCategory="POSTER"
      />

      <div style={{ marginTop: '40px', maxWidth: '600px' }}>
        <h2>Usage</h2>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          {`import StandaloneInspirationPopover from './StandaloneInspirationPopover';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Popover
      </button>
      
      <StandaloneInspirationPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inspirationTitle="Your inspiration title"
        inspirationCategory="POSTER"
      />
    </>
  );
}`}
        </pre>

        <h2>Props</h2>
        <ul>
          <li>
            <strong>isOpen</strong>: boolean - Controls if the popover is visible
          </li>
          <li>
            <strong>onClose</strong>: function - Called when the popover should be closed
          </li>
          <li>
            <strong>inspirationTitle</strong>: string (optional) - The title to display
          </li>
          <li>
            <strong>inspirationCategory</strong>: string (optional) - The category type
          </li>
        </ul>

        <h2>Features</h2>
        <ul>
          <li>✅ Zero dependencies (no Easel, no external UI libraries)</li>
          <li>✅ Fully responsive design</li>
          <li>✅ Smooth animations</li>
          <li>✅ Accessible backdrop click to close</li>
          <li>✅ Modern CSS with proper hover states</li>
          <li>✅ TypeScript support</li>
        </ul>
      </div>
    </div>
  );
};

export default StandaloneInspirationPopoverDemo;
