/* Mobile Templates pills — reuses the exact desktop CategoryPills markup/
   styles (Business / Social media / Video / Learn Grid). Wrapped to strip
   the desktop 16px top padding so it snugs against the Wonderbox on mobile. */
import CategoryPills from '@/pages/Home/Templates/components/CategoryPills';
import styles from './TemplatePills.module.css';

export default function TemplatePills(): React.ReactNode {
  return (
    <div className={styles.wrapper}>
      <CategoryPills />
    </div>
  );
}
