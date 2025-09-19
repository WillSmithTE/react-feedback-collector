import { useEffect, RefObject } from 'react';

interface UseClickOutsideOptions {
  enabled?: boolean;
  ignoreElements?: RefObject<HTMLElement>[];
}

/**
 * Hook to detect clicks outside of a target element
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, ignoreElements = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if the target element exists
      if (!ref.current) return;

      const target = event.target as Node;
      if (!target) return;

      // Check if the click was inside the target element
      if (ref.current.contains(target)) return;

      // Check if the click was inside any of the ignored elements
      for (const ignoreRef of ignoreElements) {
        if (ignoreRef.current && ignoreRef.current.contains(target)) {
          return;
        }
      }

      // If we reach here, the click was outside - execute callback
      callback();
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback, enabled, ignoreElements]);
}

/**
 * Hook to detect clicks outside multiple elements
 */
export function useClickOutsideMultiple(
  refs: RefObject<HTMLElement>[],
  callback: () => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, ignoreElements = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!target) return;

      // Check if the click was inside any of the target elements
      const isInsideTargets = refs.some(ref => 
        ref.current && ref.current.contains(target)
      );
      
      if (isInsideTargets) return;

      // Check if the click was inside any of the ignored elements
      const isInsideIgnored = ignoreElements.some(ignoreRef => 
        ignoreRef.current && ignoreRef.current.contains(target)
      );
      
      if (isInsideIgnored) return;

      // If we reach here, the click was outside all targets - execute callback
      callback();
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, callback, enabled, ignoreElements]);
}

/**
 * Hook to handle escape key and outside clicks together
 */
export function useCloseOnOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  options: UseClickOutsideOptions & { 
    enableEscapeKey?: boolean;
    disableOnScroll?: boolean;
  } = {}
) {
  const { 
    enabled = true, 
    ignoreElements = [], 
    enableEscapeKey = true,
    disableOnScroll = false
  } = options;

  useClickOutside(ref, callback, { enabled, ignoreElements });

  // Handle escape key
  useEffect(() => {
    if (!enabled || !enableEscapeKey) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [callback, enabled, enableEscapeKey]);

  // Handle scroll (optional - some UIs close on scroll)
  useEffect(() => {
    if (!enabled || !disableOnScroll) return;

    const handleScroll = () => {
      callback();
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [callback, enabled, disableOnScroll]);
}