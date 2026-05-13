import { useState, useCallback, useRef, useEffect } from 'react';
import type { Point, Bounds } from '@/utils/transformUtils';
import { calculateRotation, getCenter } from '@/utils/transformUtils';

interface UseRotationOptions {
  initialRotation?: number;
  elementBounds: Bounds;
  onRotationStart?: () => void;
  onRotate?: (rotation: number) => void;
  onRotationEnd: (rotation: number) => void;
  enabled?: boolean;
  snapAngle?: number; // Snap to multiples of this angle (e.g., 15 for 15 increments)
}

interface UseRotationResult {
  rotation: number;
  isRotating: boolean;
  handleRotationStart: (e: React.MouseEvent) => void;
}

export function useRotation({
  initialRotation = 0,
  elementBounds,
  onRotationStart,
  onRotate,
  onRotationEnd,
  enabled = true,
  snapAngle = 15,
}: UseRotationOptions): UseRotationResult {
  const [rotation, setRotation] = useState(initialRotation);
  const [isRotating, setIsRotating] = useState(false);

  const rotationStartRef = useRef<Point>({ x: 0, y: 0 });
  const initialRotationRef = useRef(initialRotation);
  const centerRef = useRef<Point>(getCenter(elementBounds));
  const isRotatingRef = useRef(false);
  const initialAngleRef = useRef(0);
  const prevInitialRotationRef = useRef(initialRotation);

  // Update rotation when initialRotation changes
  useEffect(() => {
    if (!isRotatingRef.current) {
      if (prevInitialRotationRef.current !== initialRotation) {
        setRotation(initialRotation);
        prevInitialRotationRef.current = initialRotation;
      }
    }
  }, [initialRotation]);

  // Update center when bounds change
  useEffect(() => {
    centerRef.current = getCenter(elementBounds);
  }, [elementBounds]);

  const handleRotationStart = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;

      e.stopPropagation();
      e.preventDefault();

      rotationStartRef.current = { x: e.clientX, y: e.clientY };
      initialRotationRef.current = rotation;
      isRotatingRef.current = true;
      setIsRotating(true);

      // Calculate initial angle
      const center = centerRef.current;
      initialAngleRef.current =
        Math.atan2(rotationStartRef.current.y - center.y, rotationStartRef.current.x - center.x)
        * (180 / Math.PI);

      onRotationStart?.();

      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },
    [enabled, rotation, onRotationStart],
  );

  useEffect(() => {
    if (!isRotatingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRotatingRef.current) return;

      const center = centerRef.current;
      const currentPoint = { x: e.clientX, y: e.clientY };

      let newRotation = calculateRotation(center, currentPoint, initialAngleRef.current);

      // Add initial rotation
      newRotation += initialRotationRef.current;

      // Snap to angle if Shift is held
      if (e.shiftKey && snapAngle > 0) {
        newRotation = Math.round(newRotation / snapAngle) * snapAngle;
      }

      // Normalize to -180 to 180
      while (newRotation > 180) newRotation -= 360;
      while (newRotation < -180) newRotation += 360;

      setRotation(newRotation);
      onRotate?.(newRotation);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isRotatingRef.current) return;

      const center = centerRef.current;
      const currentPoint = { x: e.clientX, y: e.clientY };

      let finalRotation = calculateRotation(center, currentPoint, initialAngleRef.current);

      // Add initial rotation
      finalRotation += initialRotationRef.current;

      // Snap to angle if Shift is held
      if (e.shiftKey && snapAngle > 0) {
        finalRotation = Math.round(finalRotation / snapAngle) * snapAngle;
      }

      // Normalize to -180 to 180
      while (finalRotation > 180) finalRotation -= 360;
      while (finalRotation < -180) finalRotation += 360;

      setRotation(finalRotation);
      setIsRotating(false);
      isRotatingRef.current = false;

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      onRotationEnd(finalRotation);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onRotate, onRotationEnd, snapAngle]);

  return {
    rotation,
    isRotating,
    handleRotationStart,
  };
}
