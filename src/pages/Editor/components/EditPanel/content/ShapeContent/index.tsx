import React, { useMemo } from 'react';
import { Box, Text, Carousel, Button } from '@canva/easel';
import { XIcon } from '@canva/easel/icons';
import styles from './ShapeContent.module.css';

interface ShapeContentProps {
  onClose?: () => void;
}

type Shape = { id: string; title?: string; svg: React.ReactNode };

function ShapeThumb({ svg }: { svg: React.ReactNode }): React.ReactNode {
  return (
    <Box className={styles.thumb} display="flex" alignItems="center" justifyContent="center">
      {svg}
    </Box>
  );
}

export default function ShapeContent({ onClose }: ShapeContentProps): React.ReactNode {
  const basicShapes: Shape[] = useMemo(
    () => [
      {
        id: 'g1-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M0 0H64V64H0z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M10,0L54,0C59.5228,0 64,4.4771 64,10L64,54C64,59.5228 59.5228,64 54,64L10,64C4.4771,64 0,59.5228 0,54L0,10C0,4.4771 4.4771,0 10,0"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M32 0A32 32 0 1 0 32 64A32 32 0 1 0 32 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 56">
            <path d="M32 0L64 56H0L32 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 56">
            <path d="M32 56L64 0H0L32 56Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M32 0L64 32L32 64L0 32L32 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-7',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M44 0H20V20H0V44H20V64H44V44H64V20H44V0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-8',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 56">
            <path d="M0 4L32 0L64 4V52L32 56L0 52V4Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-9',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M57.7466 0H6.25339C6.25339 3.44086 3.47078 6.25339 0 6.25339V57.7466C3.44086 57.7466 6.25339 60.5292 6.25339 64H57.7466C57.7466 60.5591 60.5292 57.7466 64 57.7466V6.25339C60.5591 6.25339 57.7466 3.47078 57.7466 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-10',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 48">
            <path d="M16 0H64L48 48H0L16 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-11',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 48">
            <path d="M48 0H0L16 48H64L48 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-12',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 48">
            <path d="M16 0H48L64 48H0L16 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-13',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 48">
            <path d="M16 48H48L64 0H0L16 48Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-14',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 52 64">
            <path
              d="M17.3427 62.4985C20.0086 63.4051 23.0394 64 26.014 64C28.9887 64 31.8511 63.49 34.4889 62.5834C34.5451 62.5551 34.6012 62.5551 34.6573 62.5268C44.5634 58.9004 51.8597 49.3245 52 38.1337V0H0V38.1054C0.140313 49.3811 7.32434 58.9571 17.3427 62.4985Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-15',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 52 64">
            <path
              d="M17.3427 1.50154C20 0.594948 23.0394 0 26.014 0C28.9887 0 31.8511 0.509956 34.4889 1.41655C34.5451 1.44489 34.6012 1.44489 34.6573 1.47321C44.5634 5.0996 51.8597 14.6755 52 25.8663V64H0V25.8946C0.140313 14.6189 7.32434 5.04293 17.3427 1.50154Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-16',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 45 47">
            <path d="M45 47H0V0L45 47Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g1-17',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 51 26">
            <path
              d="M51 26C51 11.8382 39.3895 0 25.5 0 11.6105 0 0 C11.8382 0 26L51 26Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-18',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 44 44">
            <path
              d="M0 44C0 32.4121 4.6934 21.0812 12.8873 12.8873 C21.0812 4.6934 32.4121 0 44 0L44 44H0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-19',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 44 44">
            <path
              d="M0 44C0 32.4121 4.6934 C21.0812 12.8873 12.8873 21.0812 4.6934 32.4121 0 44 0L44 22.4473C38.3238 22.4473 32.7736 24.7463 28.7599 28.7599 C24.7463 32.7736 22.4473 38.3238 22.4473 44H0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g1-20',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 52 26">
            <path
              d="M52 26C52 11.8382 40.1618 0 26 0 11.8382 0 0 C11.8382 0 26H14.4368C14.4368 19.7017 19.7017 14.4368 26 14.4368 C32.2983 14.4368 37.5632 19.7017 37.5632 26H52Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const polygons: Shape[] = useMemo(
    () => [
      {
        id: 'g2-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L64 24.4458L51.7771 64H12.2229L0 24.4458L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g2-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 55 64">
            <path d="M27.5 0L55 16V48L27.5 64L0 48V16L27.5 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g2-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 55">
            <path
              d="M64 27.5L48 55L16 55L0 27.5L16 0L48 0L64 27.5Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g2-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M45.25 0L64 18.75L64 45.25L45.25 64L18.75 64L0 45.25L0 18.75L18.75 0L45.25 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g2-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M51.4 0H12.6L0 12.6V51.4L12.6 64H51.4L64 51.4V12.6L51.4 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g2-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 63">
            <path
              d="M32,0L57.7,12.4L64,40.1L46.2,62.4L17.8,62.4L0,40.1L6.3,12.4Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g2-7',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 61">
            <path
              d="M41.9,0L57.9,11.6L64,30.4L57.9,49.2L41.9,60.9L22.1,60.9L6.1,49.2L0,30.4L6.1,11.6L22.1,0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const stars: Shape[] = useMemo(
    () => [
      {
        id: 'g3-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L42.1823 21.8177L64 32L42.1823 42.1823L32 64L21.8177 42.1823L0 32L21.8177 21.8177L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 61">
            <path
              d="M32 0L39.5542 23.2999H64L44.2229 37.7001L51.7771 61L32 46.5999L12.2229 61L19.7771 37.7001L0 23.2999H24.4458L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 56 64">
            <path
              d="M28 0L39.3484 12.5456L56 16L50.6968 32L56 48L39.3484 51.4544L28 64L16.6516 51.4544L0 48L5.3032 32L0 16L16.6516 12.5456L28 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L41.1844 9.82689L54.6274 9.37258L54.1731 22.8156L64 32L54.1731 41.1844L54.6274 54.6274L41.1844 54.1731L32 64L22.8156 54.1731L9.37258 54.6274L9.82689 41.1844L0 32L9.82689 22.8156L9.37258 9.37258L22.8156 9.82689L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L42.5682 6.48614L54.6274 9.37258L57.5139 21.4318L64 32L57.5139 42.5682L54.6274 54.6274L42.5682 57.5139L32 64L21.4318 57.5139L9.37258 54.6274L6.48614 42.5682L0 32L6.48614 21.4318L9.37258 9.37258L21.4318 6.48614L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L38.2117 8.81778L48 4.28719L48.9706 15.0294L59.7128 16L55.1822 25.7883L64 32L55.1822 38.2117L59.7128 48L48.9706 48.9706L48 59.7128L38.2117 55.1822L32 64L25.7883 55.1822L16 59.7128L15.0294 48.9706L4.28719 48L8.81778 38.2117L0 32L8.81778 25.7883L4.28719 16L15.0294 15.0294L16 4.28719L25.7883 8.81778L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-7',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L36.7241 6.89458L43.6093 2.17944L45.5344 10.3223L53.6506 8.42343L52.5168 16.7149L60.7679 17.8887L56.7282 25.2088L64 29.2968L57.6 34.6571L62.9103 41.1072L55.0143 43.7837L57.646 51.7247L49.3205 51.3558L48.918 59.7153L41.2874 56.351L37.9052 64L32 58.0946L26.0948 64L22.7126 56.351L15.082 59.7153L14.6795 51.3558L6.35405 51.7247L8.98564 43.7837L1.08972 41.1072L6.4 34.6571L0 29.2968L7.27178 25.2088L3.23205 17.8887L11.4832 16.7149L10.3494 8.42343L18.4656 10.3223L20.3907 2.17944L27.2759 6.89458L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-8',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L36.5053 3.55458L41.8885 1.56619L45.0749 6.33901L50.8091 6.11146L52.3647 11.6353L57.8885 13.1909L57.661 18.9251L62.4338 22.1115L60.4454 27.4947L64 32L60.4454 36.5053L62.4338 41.8885L57.661 45.0749L57.8885 50.8091L52.3647 52.3647L50.8091 57.8885L45.0749 57.661L41.8885 62.4338L36.5053 60.4454L32 64L27.4947 60.4454L22.1115 62.4338L18.9251 57.661L13.1909 57.8885L11.6353 52.3647L6.11146 50.8091L6.33901 45.0749L1.56619 41.8885L3.55458 36.5053L0 32L3.55458 27.4947L1.56619 22.1115L6.33901 18.9251L6.11146 13.1909L11.6353 11.6353L13.1909 6.11146L18.9251 6.33901L22.1115 1.56619L27.4947 3.55458L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-9',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 54 53">
            <path
              d="M27,0L34.2,12.8L48.7,10.4L43.1,24L54,33.9L39.9,38L39,52.6L27,44.2L15,52.6L14.1,38L0,33.9L10.9,24L5.3,10.4L19.8,12.8Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-10',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 52 55">
            <path
              d="M26,0L28,21.1L42.1,5.2L31.3,23.5L52,18.9L32.5,27.3L52,35.8L31.3,31.2L42.1,49.5L28,33.5L26,54.7L24,33.5L9.9,49.5L20.7,31.2L0,35.8L19.5,27.3L0,18.9L20.7,23.5L9.9,5.2L24,21.1Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-11',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 54 53">
            <path
              d="M27,0L30.1,16.6L41.7,4.3L35.4,20L51.8,15.9L38,25.7L54,31.2L37.1,31.9L47.6,45.1L33,36.6L34.7,53.5L27,38.4L19.3,53.5L21,36.6L6.4,45.1L16.9,31.9L0,31.2L16,25.7L2.2,15.9L18.6,20L12.3,4.3L23.9,16.6Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-12',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 54 54">
            <path
              d="M27,0L29.3,17.7L39.6,3.1L33.5,19.9L49.4,11.7L36.2,23.7L54,23.9L36.7,28.4L52.4,36.8L35.1,32.8L45,47.6L31.6,35.9L33.5,53.6L27,37L20.5,53.6L22.4,35.9L9,47.6L18.9,32.8L1.6,36.8L17.3,28.4L0,23.9L17.8,23.7L4.6,11.7L20.5,19.9L14.4,3.1L24.7,17.7Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g3-13',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 56 57">
            <path
              d="M28,0L31,3.4L34.8,0.8L36.9,4.8L41.1,3.2L42.2,7.6L46.7,7.1L46.7,11.6L51.2,12.2L50.2,16.6L54.4,18.2L52.3,22.2L56,24.8L53,28.2L56,31.6L52.3,34.2L54.4,38.2L50.2,39.8L51.2,44.2L46.7,44.8L46.7,49.3L42.2,48.8L41.1,53.2L36.9,51.6L34.8,55.6L31,53L28,56.4L25,53L21.2,55.6L19.1,51.6L14.9,53.2L13.8,48.8L9.3,49.3L9.3,44.8L4.8,44.2L5.8,39.8L1.6,38.2L3.7,34.2L0,31.6L3,28.2L0,24.8L3.7,22.2L1.6,18.2L5.8,16.6L4.8,12.2L9.3,11.6L9.3,7.1L13.8,7.6L14.9,3.2L19.1,4.8L21.2,0.8L25,3.4Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const arrows: Shape[] = useMemo(
    () => [
      {
        id: 'g4-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M64 32L32 0V16H0V48H32V64L64 32Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g4-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M0 32L32 0V16H64V48H32V64L0 32Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g4-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 0L0 32L16 32L16 64L48 64L48 32L64 32L32 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g4-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path
              d="M32 64L0 32L16 32L16 0L48 0L48 32L64 32L32 64Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g4-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 42">
            <path
              d="M21.5 0L0 21L21.5 42V31.5H42.5V42L64 21L42.5 0V10.5H21.5V0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g4-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 42 64">
            <path
              d="M0 42.5L21 64L42 42.5H31.5L31.5 21.5H42L21 0L0 21.5H10.5V42.5H0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g4-7',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 32">
            <path d="M48 0H0V32H48L64 16L48 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g4-8',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 32">
            <path d="M0 0H48L64 16L48 32H0L16 16L0 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g4-9',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 51 42">
            <path
              d="M18.8493 13.1038H51V28.8931H18.8483L23.7996 42L0 21L23.7996 0L18.8493 13.1038Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g4-10',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 58 36">
            <path
              d="M58 18.0005L37.5302 36L38.771 26.1774H19.229L20.4698 36L0 18.0005L20.4698 0L19.228 9.82562H38.772L37.5302 0L58 18.0005Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const flowchart: Shape[] = useMemo(
    () => [
      {
        id: 'g5-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 32">
            <path d="M48 0H16L0 16L16 32H48L64 16L48 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g5-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 32">
            <path
              d="M48 0A16 16 0 01 48 32H16A16 16 0 01 16 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 50 33">
            <path
              d="M4,0.55H44C46.57,0.55 47.45,1.43 47.45,4V28C47.45,30.57 46.57,31.45 44,31.45H4C1.43,31.45 0.55,30.57 0.55,28V4C0.55,1.43 1.43,0.55 4,0.55Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 51 41">
            <path
              d="M23.0938 1.42871C23.6233 1.00506 24.3767 1.00506 24.9062 1.42871L46.7041 18.8682C47.4295 19.4486 47.4295 20.5514 46.7041 21.1318L24.9062 38.5713C24.3767 38.9949 23.6233 38.9949 23.0938 38.5713L1.2959 21.1318C0.570468 20.5514 0.570468 19.4486 1.2959 18.8682L23.0938 1.42871Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 49 35">
            <path
              d="M4 0.549805H44C45.9054 0.549805 47.4502 2.09462 47.4502 4V29.4219C43.4258 26.7837 34.2195 24.0667 22.7256 30.0117C10.8983 36.129 3.08139 32.7029 0.549805 30.2686V4C0.549805 2.09462 2.09462 0.549805 4 0.549805Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 58 39">
            <path
              d="M17.7812 0.549805H51.877C52.9346 0.549805 53.6366 1.64579 53.1943 2.60645L37.5361 36.6064C37.2994 37.1206 36.7848 37.4502 36.2188 37.4502H2.12305C1.06543 37.4502 0.363395 36.3542 0.805664 35.3936L16.4639 1.39355C16.7006 0.87944 17.2152 0.549805 17.7812 0.549805Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-7',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 49 33">
            <path
              d="M2.56152 0.549805H45.4385C46.3818 0.549824 47.0735 1.43641 46.8447 2.35156L39.8447 30.3516C39.6834 30.997 39.1038 31.4502 38.4385 31.4502H9.56152C8.89618 31.4502 8.31664 30.997 8.15527 30.3516L1.15527 2.35156C0.926489 1.43641 1.61821 0.549823 2.56152 0.549805Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-8',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 48 33">
            <path
              d="M2 0.549805H30C38.5328 0.549805 45.4502 7.4672 45.4502 16C45.4502 24.5328 38.5328 31.4502 30 31.4502H2C1.19919 31.4502 0.549805 30.8008 0.549805 30V2C0.549805 1.19919 1.19919 0.549805 2 0.549805Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-9',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 55 48">
            <path
              d="M3.49,0.78H55.85C57.52,0.78 58.57,2.47 57.76,3.83L31.52,48.89C30.72,50.25 29.28,50.25 28.48,48.89L2.24,3.83C1.43,2.47 2.48,0.78 4.15,0.78Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-10',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 50 33">
            <path
              d="M13.7314 0.549805H43.6494C44.1264 0.549805 44.5262 0.782256 44.7119 1.15234C45.6019 2.92586 47.4502 7.61571 47.4502 16C47.4502 24.3843 45.6019 29.0741 44.7119 30.8477C44.5262 31.2177 44.1264 31.4502 43.6494 31.4502H13.7314C13.2904 31.4501 12.8737 31.249 12.5986 30.9043L1.42578 16.9043C1.00356 16.3752 1.00356 15.6248 1.42578 15.0957L12.5986 1.0957C12.8737 0.75103 13.2904 0.549851 13.7314 0.549805Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g5-11',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 41 43">
            <path
              d="M0.564451 2.01074C0.558633 1.20585 1.20974 0.549805 2.01465 0.549805L37.8311 0.549803C38.6277 0.549803 39.2754 1.19267 39.2812 1.98926L39.4434 24.4082C39.4464 24.841 39.2557 25.2525 38.9238 25.5303L21.0225 40.5049C20.484 40.9553 19.6996 40.9553 19.1611 40.5049L1.24609 25.5195C0.919547 25.2464 0.729639 24.8427 0.726562 24.417L0.564451 2.01074Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const speech: Shape[] = useMemo(
    () => [
      {
        id: 'g6-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 64">
            <path d="M64 0H0V49.2H12.4V64L36.5 49.2H64L64 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g6-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 56">
            <path
              d="M41.7615 0H22.2368C9.95482 0 0 9.72535 0 21.7221C0 30.407 5.21881 37.8984 12.7588 41.3741V56L27.8617 43.4435H41.7615C54.0443 43.4435 64 33.7181 64 21.7213C64.0009 9.72535 54.0443 0 41.7615 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g6-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 59 44">
            <path
              d="M31.9719 0C35.9531 0 38.8766 2.5495 40.8758 5.497 C44.5035 4.5889 47.5464 4.9027 49.9905 7.162 C51.9908 9.0113 52.8716 11.647 52.6501 14.3201 C57.2036 16.7491 59.8259 21.2938 58.7655 25.6577 C57.5829 30.5237 51.6652 33.6514 46.3148 32.8656 C44.7868 35.7559 42.0357 38.0266 38.5479 38.8844 C33.8957 40.0283 29.2285 38.3437 26.4539 34.9489L11.2538 44C13.5717 41.3028 15.8575 38.8844 16.5439 34.6959 C14.6321 35.2436 12.4155 35.0907 10.3566 34.1054 C6.7299 32.3698 5.1156 28.5527 5.6459 25.3281 C3.581 23.9639 0 21.9953 0 17.3356 C0 13.0151 4.6891 9.6983 9.0917 9.7861 C9.568 8.0161 10.5943 6.3878 12.1399 5.1793 C15.4183 2.6166 20.4614 3.0593 23.1719 5.2779 C25.0652 2.0396 28.0809 0 31.9719 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g6-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 50 45">
            <path
              d="M44 0C47 0 50 2 50 5V29C50 32 47 35 44 35H21L10 45V35H6C3 35 0 32 0 29V5C0 2 3 0 6 0H44Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g6-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 50 44">
            <path
              d="M34 0C42.7.5 49.6 7.4 50 16V20.4C49.6 28.9 42.7 35.8 34.2 35.8H21.6C19.3 38.5 16.8 40.9 13.9 42.9L12 44C11 44 10.8 43.4 11.1 42.4 11.8 40.2 11.7 37.9 10.9 35.8L10.6 34.9C4.5 32.9.1 27.1 0 20.4V15.9C0 7.4 7 .5 16 0H34.2Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const clouds: Shape[] = useMemo(
    () => [
      {
        id: 'g7-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 42">
            <path
              d="M36.3378 0C37.0398 0 37.746 0 38.4466 0C44.0323 0.701488 47.5231 3.03656 49.1131 6.85746C58.4254 6.34791 65.196 13.5727 61.0698 20.6635C62.4419 22.1535 63.5866 23.8202 64 26.0572C64 26.698 64 27.3373 64 27.978C62.768 33.6714 57.4667 37.5186 48.7634 36.4829C46.5241 39.4062 42.5395 42.3337 36.3391 41.9691C33.1342 41.7772 30.9046 40.6656 28.9525 39.3151C26.8964 40.4377 24.6696 41.3187 21.4522 41.3284C14.0087 41.345 9.02929 37.0201 8.90858 31.0878C4.12339 29.7 0.882395 27.1095 0 22.6768C0 22.0361 0 21.394 0 20.756C0.973964 16.3635 4.03876 13.6044 9.14167 12.4348C8.83505 5.02503 19.0423 0.394932 27.4278 3.65934C29.4243 2.04509 32.249 0.284462 36.3378 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g7-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 59 29">
            <path
              d="M28.9324 0C34.3385 0 38.9007 3.0354 40.3571 7.1931 C42.1225 6.5836 44.1357 6.5539 46.0674 7.2485 C49.3617 8.4334 51.4553 11.3757 51.5642 14.5H51.6246C55.6977 14.5 59 17.7464 59 21.7505 C58.9999 25.7545 55.6977 29 51.6246 29H7.3754C3.3024 28.9999 0 25.7545 0 21.7505 C0 17.2608 3.8297 14.5 8.0865 14.5 C6.8716 10.4464 10.0409 6.4154 14.1978 5.9206 C15.4842 5.7676 16.7297 5.9433 17.8411 6.3741 C19.5788 2.643 23.8882 0 28.9324 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g7-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 59 29">
            <path
              d="M23.8264 0C29.5113 0 34.4983 2.51694 37.305 6.29987C39.7712 4.91345 42.825 4.56666 45.7088 5.60374C48.9273 6.76132 51.1745 9.37059 51.9631 12.3967C55.9605 13.0826 58.9998 16.5085 59 20.6345C59 25.2546 55.1901 28.9999 50.4904 29H8.50959C3.53359 28.9999 0 25.717 0 20.6345C0.000236072 16.1842 3.53556 12.546 7.99587 12.2848C8.65983 5.40734 15.4934 0.000217657 23.8264 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g7-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 54 32">
            <path
              d="M24 0C31 0 36.4 4.5 38.6 10 39.8 9.6 41.1 9.4 42.5 9.4 48.8 9.4 54 14.6 54 20.9 54 27.3 49 32 43 32H12C4 32 .1 28.1.1 22.6.1 17.4 4.1 13.1 9.1 12.7 10.5 5.8 16 0 24 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g7-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 48 32">
            <path
              d="M21.7146 0C30.4081 0.000150824 38.0367 6.89018 37.7017 15.4485H39.4286C44.1624 15.4485 48 19.1537 48 23.7242C47.9998 28.2946 44.1623 31.9999 39.4286 32H8.57139C3.83775 31.9999 0.000246848 28.2946 0 23.7242C0 20.1076 2.40343 17.0339 5.7518 15.9079C5.12389 7.19091 12.8389 0 21.7146 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const hearts: Shape[] = useMemo(
    () => [
      {
        id: 'g8-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 56">
            <path
              d="M2.53725 8.94154C-2.65195 17.4906 1.00387 25.8117 5.59813 30.2281L32.4604 56L58.7557 30.3202C63.0287 25.5693 64.6666 20.5299 63.7569 14.9185C62.5004 7.1561 56.1037 1.13372 48.2017 0.273726C43.3553 -0.248088 38.6736 1.12342 35.0197 4.15976C34.0362 4.97672 33.1572 5.89005 32.3911 6.88277C31.4821 5.75248 30.4163 4.71854 29.2108 3.80219C25.009 0.608875 19.6604 -0.658994 14.5228 0.327059C9.65689 1.26705 5.28924 4.40582 2.53725 8.94154Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g8-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 55 50">
            <path
              d="M54.2682 10.5654C52.5284 4.65757 46.9122 0.000165555 40.2712 0C34.6955 0 29.8514 3.14603 27.4026 7.76666C24.9538 3.14614 20.1104 0.000138996 14.5349 0C7.5882 0 1.51248 4.65757 0.319535 11.4175C-2.7055 28.5591 16.4674 41.9767 27.4458 50C37.596 42.582 59.2425 27.4566 54.2682 10.5654Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g8-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 55 46">
            <path
              d="M55 13.9145C54.6352 5.35175 48.6295 0 40.7722 0C34.8046 0.000172457 29.2747 3.59401 26.9599 8.68934C24.734 3.59414 19.4178 0 13.6797 0C6.12468 0 0.350826 5.35177 0 13.9145C0 31.7007 13.6353 40.4257 26.9599 46C40.8191 40.4258 55 31.7028 55 13.9145Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g8-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 48 50">
            <path
              d="M38.6145 0.620514C31.3331 -1.80346 26.1022 3.48007 23.9991 6.06034C21.8956 3.47982 16.6654 -1.80331 9.38459 0.620514C1.69029 3.18205 -1.40637 11.0557 0.591334 20.7465C3.59414 35.313 18.0815 47.0021 23.9991 50C29.916 47.003 44.4058 35.3138 47.4088 20.7465C49.4065 11.0557 46.3089 3.18201 38.6145 0.620514Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g8-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 54 57">
            <path
              d="M26.9992 16.7576C32.6838 -2.45485 44.052 -2.45485 49.7366 3.49104C55.4211 9.43592 55.4211 21.3267 49.7366 33.2185C45.7571 42.1358 35.5256 51.0541 26.9992 57C18.4737 51.0541 8.24221 42.1358 4.26276 33.2185C-1.42092 21.3267 -1.42092 9.43592 4.26276 3.49104C9.94732 -2.45485 21.3156 -2.45485 26.9992 16.7576Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const banners: Shape[] = useMemo(
    () => [
      {
        id: 'g9-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 64 32">
            <path d="M64 0H0L8 16L0 32H64L56 16L64 0Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g9-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 50 64">
            <path d="M50 0V55L25 64L0 55L0 0H50Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g9-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 58 64">
            <path d="M58 0V64L29 54L0 64L0 0H58Z" vectorEffect="non-scaling-stroke" />
          </svg>
        ),
      },
      {
        id: 'g9-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 30 49">
            <path
              d="M30 3.9 30 35.7 15 49 0 35.7 0 3.9C0 1.8 1.8 0 3.9 0L26.1 0C28.2 0 30 1.8 30 3.9Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g9-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 30 43">
            <path
              d="M30 3.9 30 43 15 35.2 0 43 0 3.9C0 1.8 1.8 0 3.9 0L26.1 0C28.2 0 30 1.7 30 4Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g9-6',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 30 35">
            <path
              d="M30 3.9 30 35 15 24.9 0 35 0 3.9C0 1.8 1.8 0 3.9 0L26.1 0C28.2 0 30 2 30 3.9Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const teardrops: Shape[] = useMemo(
    () => [
      {
        id: 'g10-1',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 28 48">
            <path
              d="M28 34.0465C28 41.7528 21.732 48 14 48C6.26801 48 0 41.7528 0 34.0465C0 26.3402 14 0 14 0C14 0 28 26.3402 28 34.0465Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g10-2',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 28 48">
            <path
              d="M28 34.0465C28 41.7528 21.732 48 14 48C6.26801 48 0 41.7528 0 34.0465C0 12.2791 14 0 14 0C14 0 28 12.8372 28 34.0465Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g10-3',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 35 48">
            <path
              d="M35 31.7125C35 39.4188 27.165 48 17.5 48C7.83502 48 0 39.4188 0 31.7125C0 11.0106 17.5 0 17.5 0C17.5 0 35 10.4524 35 31.7125Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g10-4',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 40 51">
            <path
              d="M40 32.4983C40 43.0608 31.0457 51 20 51C8.9543 51 0 43.0608 0 32.4983C0 18.8759 20 0 20 0C20 0 40 18.8759 40 32.4983Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
      {
        id: 'g10-5',
        svg: (
          <svg width="64" height="64" className="_gVFWg puDYqA" viewBox="0 0 32 55">
            <path
              d="M16 0C22.9845 10.3904 32 27.5813 32 39.4021 C32 48.011 24.8299 55 16 55 C7.1696 54.9998 0 48.0109 0 39.4021 C0 27.5814 18.7929 17.199 16 0Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const sections: Array<{ title: string; items: Shape[] }> = [
    { title: 'Basic shapes', items: basicShapes },
    { title: 'Polygons', items: polygons },
    { title: 'Stars', items: stars },
    { title: 'Arrows', items: arrows },
    { title: 'Flowchart shapes', items: flowchart },
    { title: 'Speech bubbles', items: speech },
    { title: 'Clouds', items: clouds },
    { title: 'Hearts', items: hearts },
    { title: 'Banners', items: banners },
    { title: 'Teardrops', items: teardrops },
  ];

  return (
    <Box height="full" display="flex" flexDirection="column">
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            Edit
          </Text>
          {onClose && (
            <Button
              variant="tertiary"
              size="small"
              icon={() => <XIcon size="medium" />}
              onClick={onClose}
            />
          )}
        </Box>
      </Box>

      <Box className={styles.scrollArea}>
        {sections.map(section => (
          <Box key={section.title} paddingBottom="3u">
            <Box paddingX="2u">
              <Text weight="bold" size="medium">
                {section.title}
              </Text>
            </Box>
            <Box paddingTop="1u" paddingX="3u">
              <Carousel name={section.title} gutter="small" expand="medium" buttonVariant="chevron">
                {section.items.map(item => (
                  <ShapeThumb key={item.id} svg={item.svg} />
                ))}
              </Carousel>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
