import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DirectionContext = createContext('forward');
export const useNavigationDirection = () => useContext(DirectionContext);

export function NavigationDirectionProvider({ children }) {
  const location = useLocation();
  const stack = useRef([location.pathname]);
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    const s = stack.current;
    const top = s[s.length - 1];
    if (location.pathname === top) return;
    const idx = s.lastIndexOf(location.pathname);
    if (idx !== -1) {
      s.splice(idx + 1);
      setDirection('back');
    } else {
      s.push(location.pathname);
      setDirection('forward');
    }
  }, [location.pathname]);

  return (
    <DirectionContext.Provider value={direction}>{children}</DirectionContext.Provider>
  );
}