import { useEffect, useRef } from 'react';

const useDebounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const debounceFunc = (...args: Parameters<F>) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debounceFunc;
};

export default useDebounce;
