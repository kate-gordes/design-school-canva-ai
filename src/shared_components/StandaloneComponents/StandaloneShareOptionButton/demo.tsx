import React, { useState } from 'react';
import StandaloneShareOptionButton from './index';

// Demo component showing how to use the standalone share option button
export const StandaloneShareOptionButtonDemo: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Sample SVG icons
  const DownloadIcon = () => (
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
  );

  const PresentIcon = () => (
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
  );

  const CheckIcon = () => (
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
  );

  const LinkIcon = () => (
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
  );

  const PrintIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  );

  const CameraIcon = () => (
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
  );

  const GlobeIcon = () => (
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

  const MoreIcon = () => (
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
  );

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Standalone Share Option Button Demo</h1>
        <p style={{ marginBottom: '40px', color: '#666' }}>
          This component has no dependencies on Easel or any other UI library.
        </p>

        {/* Example 1: Grid of buttons */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>Action Grid (like in Share Menu)</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <StandaloneShareOptionButton
              icon={DownloadIcon}
              label="Download"
              onClick={() => {
                setSelectedAction('download');
                console.log('Download clicked');
              }}
              selected={selectedAction === 'download'}
            />

            <StandaloneShareOptionButton
              icon={PresentIcon}
              label="Present"
              onClick={() => {
                setSelectedAction('present');
                console.log('Present clicked');
              }}
              selected={selectedAction === 'present'}
            />

            <StandaloneShareOptionButton
              icon={CheckIcon}
              label="Request approval"
              onClick={() => {
                setSelectedAction('request-approval');
                console.log('Request approval clicked');
              }}
              selected={selectedAction === 'request-approval'}
            />

            <StandaloneShareOptionButton
              icon={LinkIcon}
              label="View-only link"
              onClick={() => {
                setSelectedAction('view-only');
                console.log('View-only link clicked');
              }}
              selected={selectedAction === 'view-only'}
            />

            <StandaloneShareOptionButton
              icon={PrintIcon}
              label="Print with Canva"
              onClick={() => {
                setSelectedAction('print');
                console.log('Print clicked');
              }}
              selected={selectedAction === 'print'}
            />

            <StandaloneShareOptionButton
              icon={CameraIcon}
              label="Present and record"
              onClick={() => {
                setSelectedAction('present-record');
                console.log('Present and record clicked');
              }}
              selected={selectedAction === 'present-record'}
            />

            <StandaloneShareOptionButton
              icon={GlobeIcon}
              label="Website"
              onClick={() => {
                setSelectedAction('website');
                console.log('Website clicked');
              }}
              selected={selectedAction === 'website'}
            />

            <StandaloneShareOptionButton
              icon={MoreIcon}
              label="See all"
              onClick={() => {
                setSelectedAction('see-all');
                console.log('See all clicked');
              }}
              selected={selectedAction === 'see-all'}
            />
          </div>
          {selectedAction && (
            <p style={{ marginTop: '16px', color: '#8b5cf6', fontWeight: '600' }}>
              Selected: {selectedAction}
            </p>
          )}
        </section>

        {/* Example 2: Individual buttons */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '20px' }}>Individual Buttons</h2>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <StandaloneShareOptionButton
              icon={<DownloadIcon />}
              label="Download"
              onClick={() => console.log('Download')}
            />

            <StandaloneShareOptionButton
              icon={<PresentIcon />}
              label="Present"
              onClick={() => console.log('Present')}
              selected={true}
            />

            <StandaloneShareOptionButton
              icon={<LinkIcon />}
              label="Share link"
              onClick={() => console.log('Share link')}
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
            {`import StandaloneShareOptionButton from './StandaloneShareOptionButton';

// Define your icon component
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="..." />
  </svg>
);

function MyComponent() {
  const [selected, setSelected] = useState(false);

  return (
    <StandaloneShareOptionButton
      icon={DownloadIcon}
      label="Download"
      onClick={() => setSelected(!selected)}
      selected={selected}
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
              <strong>icon</strong>: ReactNode | ComponentType - Icon component or element
            </li>
            <li>
              <strong>label</strong>: string - Button label text
            </li>
            <li>
              <strong>onClick</strong>: () =&gt; void - Click handler
            </li>
            <li>
              <strong>selected</strong>: boolean (optional) - Whether button is selected
            </li>
            <li>
              <strong>className</strong>: string (optional) - Additional CSS classes
            </li>
          </ul>
        </section>

        {/* Features */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Features</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>✅ Zero dependencies</li>
            <li>✅ Accepts icon as component or element</li>
            <li>✅ Selected state support</li>
            <li>✅ Hover and active states</li>
            <li>✅ Fully accessible</li>
            <li>✅ Responsive design</li>
            <li>✅ TypeScript support</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default StandaloneShareOptionButtonDemo;
