// Ported verbatim from sheet-agent-prototype:
//   src/components/SideNav/CanvaAIPanel/AiLoadingSwirl.tsx
// Renders the gradient avatar disc + spritesheet-animated Canva C/sparkle frames,
// matching the monorepo `BrandedAnimatedAvatar` visual behaviour.
import { useEffect, useId, useRef, useState } from 'react';
import looping1 from '@/assets/ai-loading/looping_1_x1.png';
import looping2 from '@/assets/ai-loading/looping_2_x1.png';
import looping3 from '@/assets/ai-loading/looping_3_x1.png';
import looping4 from '@/assets/ai-loading/looping_4_x1.png';
import looping5 from '@/assets/ai-loading/looping_5_x1.png';
import logoResolution from '@/assets/ai-loading/logo_resolution_x1.png';
import styles from './AiLoadingSwirl.module.css';

const SPRITE_SHEETS = [looping1, looping2, looping3, looping4, looping5];
const SPRITE_FRAMES = 60;
const SPRITE_SIZE = 32;
const RESOLUTION_FRAMES = 92;

function AvatarBackground({ isSpinning }: { isSpinning: boolean }) {
  const id = useId();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isSpinning && !isPlaying) {
      setIsPlaying(true);
    } else if (!isSpinning && isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying, isSpinning]);

  return (
    <svg
      fill="none"
      viewBox="3 3 26 26"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.bgSvg} ${isPlaying ? styles.bgSvgSpinning : ''}`}
      onAnimationEnd={() => setIsPlaying(false)}
      aria-hidden
    >
      <g filter={`url(#${id}-filter)`}>
        <rect x="3" y="3" width="26" height="26" rx="13" fill={`url(#${id}-gradient)`} />
      </g>
      <defs>
        <filter
          id={`${id}-filter`}
          x="3"
          y="3"
          width="26"
          height="26"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          dangerouslySetInnerHTML={{
            __html: `
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1.42878" operator="erode" in="SourceAlpha" result="effect1_innerShadow"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2.41794"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.950481 0 0 0 0 0.989277 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="0.439625" operator="erode" in="SourceAlpha" result="effect2_innerShadow"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="0.549531"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.996434 0 0 0 0 0.904917 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
          `,
          }}
        />
        <linearGradient
          id={`${id}-gradient`}
          x1="11.032"
          x2="13.577"
          y1="6.168"
          y2="28.722"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00c4cc" offset=".029" />
          <stop stopColor="#5a32fa" offset=".519" />
          <stop stopColor="#7d2ae8" offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export interface AiLoadingSwirlProps {
  /** When true, plays the brief "resolution" sprite strip (e.g. stream just finished). */
  resolved?: boolean;
  className?: string;
}

export default function AiLoadingSwirl({ resolved = false, className = '' }: AiLoadingSwirlProps) {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resolved) {
      setIsResolved(false);
      setIsResolving(false);
      setSheetIndex(0);
      if (elRef.current) {
        elRef.current.style.backgroundPositionX = '0px';
      }
    }
  }, [resolved]);

  useEffect(() => {
    if (resolved || isResolved) return;
    const msPerFrame = 1000 / 30;
    let currentFrame = 0;
    let currentSheet = 0;

    const tick = (now: number) => {
      if (now - lastTimeRef.current >= msPerFrame) {
        lastTimeRef.current = now;
        currentFrame++;
        if (currentFrame >= SPRITE_FRAMES) {
          currentFrame = 0;
          currentSheet = (currentSheet + 1) % SPRITE_SHEETS.length;
          setSheetIndex(currentSheet);
        }
        if (elRef.current) {
          elRef.current.style.backgroundPositionX = `-${currentFrame * SPRITE_SIZE}px`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resolved, isResolved]);

  useEffect(() => {
    if (!resolved || isResolved) return;
    setIsResolving(true);
    const msPerFrame = 1000 / 40;
    let currentFrame = 0;
    let startTime = 0;

    if (elRef.current) {
      elRef.current.style.backgroundPositionX = '0px';
    }

    const tick = (now: number) => {
      if (!startTime) {
        startTime = now;
      }
      const targetFrame = Math.floor((now - startTime) / msPerFrame);
      if (targetFrame > currentFrame) {
        currentFrame = targetFrame;
        if (currentFrame >= RESOLUTION_FRAMES) {
          setIsResolved(true);
          if (elRef.current) {
            elRef.current.style.backgroundPositionX = `-${(RESOLUTION_FRAMES - 1) * SPRITE_SIZE}px`;
          }
          return;
        }
        if (elRef.current) {
          elRef.current.style.backgroundPositionX = `-${currentFrame * SPRITE_SIZE}px`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resolved, isResolved]);

  const spriteImage = isResolving ? logoResolution : SPRITE_SHEETS[sheetIndex];
  const spriteWidth = isResolving ? RESOLUTION_FRAMES : SPRITE_FRAMES;

  return (
    <div className={`${styles.swirl} ${className}`.trim()} aria-hidden>
      <AvatarBackground isSpinning={!isResolved} />
      <div
        ref={elRef}
        className={styles.sprite}
        style={{
          backgroundImage: `url(${spriteImage})`,
          backgroundSize: `${spriteWidth * SPRITE_SIZE}px ${SPRITE_SIZE}px`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 0,
          backgroundPositionY: 0,
        }}
      />
    </div>
  );
}
