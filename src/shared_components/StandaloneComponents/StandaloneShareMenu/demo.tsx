import React from 'react';
import StandaloneShareMenu from './index';

// Demo component showing how to use the standalone share menu
export const StandaloneShareMenuDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Standalone Share Menu Demo</h1>
        <p style={{ marginBottom: '40px', color: '#666' }}>
          This component has no dependencies on Easel or any other UI library.
        </p>

        {/* Example 1: Basic Usage */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>Basic Usage</h2>
          <div
            style={{
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <StandaloneShareMenu />
          </div>
        </section>

        {/* Example 2: With Visitor Count */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>With Visitor Count</h2>
          <div
            style={{
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <StandaloneShareMenu visitorCount={5} />
          </div>
        </section>

        {/* Example 3: With User Info */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>With User Info</h2>
          <div
            style={{
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <StandaloneShareMenu
              visitorCount={12}
              currentUser={{
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/150?img=1',
              }}
            />
          </div>
        </section>

        {/* Usage Code */}
        <section>
          <h2 style={{ marginBottom: '20px' }}>Usage</h2>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
            }}
          >
            {`import StandaloneShareMenu from './StandaloneShareMenu';

function MyComponent() {
  return (
    <StandaloneShareMenu 
      visitorCount={5}
      currentUser={{
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg'
      }}
    />
  );
}`}
          </pre>

          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Controlled Usage</h2>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
            }}
          >
            {`import React, { useState } from 'react';
import StandaloneShareMenu from './StandaloneShareMenu';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StandaloneShareMenu 
      isOpen={isOpen}
      onToggle={setIsOpen}
      visitorCount={5}
      currentUser={{
        name: 'John Doe'
      }}
    />
  );
}`}
          </pre>
        </section>

        {/* Props Documentation */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Props</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>
              <strong>isOpen</strong>: boolean (optional) - Control the menu state
            </li>
            <li>
              <strong>onToggle</strong>: (isOpen: boolean) =&gt; void (optional) - Callback when
              menu opens/closes
            </li>
            <li>
              <strong>visitorCount</strong>: number (optional) - Number of visitors to display
            </li>
            <li>
              <strong>currentUser</strong>: object (optional) - User info with name and avatar
            </li>
          </ul>
        </section>

        {/* Features */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Features</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>✅ Zero dependencies (no Easel, no external UI libraries)</li>
            <li>✅ Fully responsive design</li>
            <li>✅ Smooth animations</li>
            <li>✅ Click outside to close</li>
            <li>✅ Access level dropdown</li>
            <li>✅ People search functionality</li>
            <li>✅ Action grid with 8 share options</li>
            <li>✅ Copy link functionality</li>
            <li>✅ TypeScript support</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default StandaloneShareMenuDemo;
