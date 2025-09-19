import { useEffect, RefObject } from 'react';

interface UseKeyboardOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: RefObject<HTMLElement> | 'document' | 'window';
}

/**
 * Hook for handling keyboard events
 */
export function useKeyboard(
  handlers: {
    onEscape?: () => void;
    onEnter?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
    onSpace?: () => void;
    [key: string]: (() => void) | undefined;
  },
  options: UseKeyboardOptions = {}
) {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
    target = 'document'
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, code } = event;
      
      // Map keys to handler names
      const keyMap: Record<string, string> = {
        'Escape': 'onEscape',
        'Enter': 'onEnter',
        'ArrowUp': 'onArrowUp',
        'ArrowDown': 'onArrowDown',
        'ArrowLeft': 'onArrowLeft',
        'ArrowRight': 'onArrowRight',
        'Tab': 'onTab',
        ' ': 'onSpace',
        'Space': 'onSpace'
      };

      // Check for handler
      const handlerName = keyMap[key] || keyMap[code] || `on${key}`;
      const handler = handlers[handlerName];

      if (handler && typeof handler === 'function') {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        handler();
      }
    };

    // Determine the target element
    let targetElement: EventTarget = document;
    
    if (typeof target === 'object' && target?.current) {
      targetElement = target.current;
    } else if (target === 'window') {
      targetElement = window;
    }

    // Add event listener
    targetElement.addEventListener('keydown', handleKeyDown as EventListener);

    // Cleanup
    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handlers, enabled, preventDefault, stopPropagation, target]);
}

/**
 * Hook for handling focus trap within a container
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    
    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(',');
      
      return Array.from(
        container.querySelectorAll(focusableSelectors)
      ) as HTMLElement[];
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: move backward
        if (activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forward
        if (activeElement === lastElement || !container.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus the first element when trap is enabled
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef, enabled]);
}

/**
 * Hook for handling arrow key navigation in a list
 */
export function useArrowNavigation(
  items: RefObject<HTMLElement>[],
  options: {
    enabled?: boolean;
    circular?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
    onSelect?: (index: number) => void;
  } = {}
) {
  const {
    enabled = true,
    circular = true,
    orientation = 'vertical',
    onSelect
  } = options;

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    let currentIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndex;
      let handled = false;

      switch (key) {
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;
        case 'Home':
          newIndex = 0;
          handled = true;
          break;
        case 'End':
          newIndex = items.length - 1;
          handled = true;
          break;
        case 'Enter':
        case ' ':
          if (onSelect) {
            onSelect(currentIndex);
            handled = true;
          }
          break;
      }

      if (handled) {
        event.preventDefault();
        
        // Handle circular navigation
        if (circular) {
          newIndex = ((newIndex % items.length) + items.length) % items.length;
        } else {
          newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
        }

        // Update focus
        const targetElement = items[newIndex]?.current;
        if (targetElement) {
          targetElement.focus();
          currentIndex = newIndex;
        }
      }
    };

    // Track focus changes to update current index
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const index = items.findIndex(item => item.current === target);
      if (index !== -1) {
        currentIndex = index;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [items, enabled, circular, orientation, onSelect]);
}