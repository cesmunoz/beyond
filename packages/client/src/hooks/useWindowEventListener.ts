import { useEffect } from 'react';

const useWindowEventListener = <K extends keyof WindowEventMap>(
  event: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
): void => {
  useEffect(() => {
    window.addEventListener(event, listener);

    return (): void => {
      window.removeEventListener(event, listener);
    };
  }, []);
};

export default useWindowEventListener;
