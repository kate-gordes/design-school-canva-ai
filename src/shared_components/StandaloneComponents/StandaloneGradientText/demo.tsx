import React from 'react';
import StandaloneGradientText from './index';

// Demo component showing how to use the standalone gradient text
export const StandaloneGradientTextDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Standalone Gradient Text Demo</h1>
        <p style={{ marginBottom: '40px', textAlign: 'center', color: '#666' }}>
          This component has no dependencies on Easel or any other UI library.
        </p>

        {/* Size Examples */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '30px' }}>Size Variants</h2>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="small">Small Gradient Text</StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="medium">Medium Gradient Text</StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="large">Large Gradient Text</StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="xlarge">XLarge Gradient Text</StandaloneGradientText>
          </div>
        </section>

        {/* Alignment Examples */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '30px' }}>Alignment Variants</h2>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="large" alignment="left">
              Left Aligned Text
            </StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="large" alignment="center">
              Center Aligned Text
            </StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="large" alignment="right">
              Right Aligned Text
            </StandaloneGradientText>
          </div>
        </section>

        {/* Mobile Variant */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '30px' }}>Mobile Variant</h2>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText size="xlarge" variant="mobile">
              Mobile Optimized Text
            </StandaloneGradientText>
          </div>
        </section>

        {/* Different HTML Tags */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ marginBottom: '30px' }}>Different HTML Tags</h2>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText tagName="h1" size="large">
              H1 Tag
            </StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText tagName="h2" size="medium">
              H2 Tag
            </StandaloneGradientText>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <StandaloneGradientText tagName="span" size="small">
              Span Tag (inline)
            </StandaloneGradientText>
          </div>
        </section>

        {/* Usage Code */}
        <section>
          <h2 style={{ marginBottom: '30px' }}>Usage</h2>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
            }}
          >
            {`import StandaloneGradientText from './StandaloneGradientText';

function MyComponent() {
  return (
    <StandaloneGradientText 
      size="xlarge" 
      alignment="center"
      tagName="h1"
    >
      Beautiful Gradient Text
    </StandaloneGradientText>
  );
}`}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default StandaloneGradientTextDemo;
