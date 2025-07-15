import { DependencyList, useEffect, useRef } from 'react';

export const useUpdateEffect = (effect: () => void, dependencies: DependencyList | undefined) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Only call the effect on updates, not on initial mount
      effect();
    }
  }, dependencies || []); // Ensure dependencies are passed correctly
}
