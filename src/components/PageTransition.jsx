import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useNavigationDirection } from '@/lib/navigationDirection.jsx';

export default function PageTransition({ children }) {
  const location = useLocation();
  const direction = useNavigationDirection();
  const x = direction === 'back' ? -28 : 28;
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}