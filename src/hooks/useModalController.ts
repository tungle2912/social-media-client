import { useCallback, useEffect, useState } from 'react';
import { usePathname } from './bridge/useNextApp';

export const useModalController = <T, S>(defaultKey?: T) => {
  const [key, setKey] = useState<T | boolean | undefined>(defaultKey);
  const [attachedData, setAttachedData] = useState<any>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    setKey(false);
  }, [pathname]);

  const open = useCallback(
    (key: T, attachedData?: S) => {
      setKey(key);
      setAttachedData(attachedData);
    },
    [defaultKey],
  );

  const close = useCallback(() => {
    setKey(undefined);
    setAttachedData(undefined);
  }, [defaultKey]);

  return {
    key,
    open,
    attachedData,
    close,
  };
};
