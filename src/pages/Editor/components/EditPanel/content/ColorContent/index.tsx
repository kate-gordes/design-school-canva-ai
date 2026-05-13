import React from 'react';
import TextColorContent from '@/pages/Editor/components/EditPanel/content/TextColorContent';

// Wrapper that reuses TextColorContent but overrides the title via props in the inner component.
// Since TextColorContent currently hardcodes its title, we reproduce its UI by composing it
// and replacing only the header text via a lightweight wrapper.

interface ColorContentProps {
  onClose?: () => void;
}

export default function ColorContent({ onClose }: ColorContentProps): React.ReactNode {
  return <TextColorContent title="Color" onClose={onClose} />;
}
