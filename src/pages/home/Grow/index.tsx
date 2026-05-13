import useIsMobile from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MobileGrow from './MobileGrow';

export default function Grow(): React.ReactNode {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Redirect to home if not on mobile (Grow is mobile-only)
  useEffect(() => {
    if (!isMobile) {
      navigate('/');
    }
  }, [isMobile, navigate]);

  if (!isMobile) {
    return null;
  }

  return <MobileGrow />;
}
