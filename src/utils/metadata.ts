import { FeedbackMetadata } from '../types';

/**
 * Collect metadata about the current page and environment
 */
export function collectPageMetadata(): FeedbackMetadata {
  // Safely access window properties with fallbacks
  const pageUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'unknown';

  const pageTitle = typeof document !== 'undefined' 
    ? document.title || 'Untitled Page'
    : 'unknown';

  const referrer = typeof document !== 'undefined' 
    ? document.referrer || undefined 
    : undefined;

  return {
    pageUrl,
    pageTitle,
    referrer,
    timestamp: Date.now()
  };
}

/**
 * Get a clean, readable page title
 */
export function getCleanPageTitle(): string {
  if (typeof document === 'undefined') return 'Unknown Page';
  
  const title = document.title;
  
  // Remove common suffixes like site names
  const cleanTitle = title
    .replace(/\s*[-|–—]\s*.*$/, '') // Remove everything after dash/pipe
    .trim();
    
  return cleanTitle || title || 'Untitled Page';
}

/**
 * Get the current page's domain
 */
export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  try {
    return new URL(window.location.href).hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Check if the current page is in an iframe
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.self !== window.top;
  } catch {
    // If accessing window.top throws an error, we're definitely in a cross-origin iframe
    return true;
  }
}

/**
 * Get browser and device information
 */
export function getBrowserInfo(): {
  browser: string;
  version: string;
  platform: string;
  mobile: boolean;
} {
  if (typeof navigator === 'undefined') {
    return {
      browser: 'unknown',
      version: 'unknown', 
      platform: 'unknown',
      mobile: false
    };
  }

  const userAgent = navigator.userAgent;
  
  // Detect browser
  let browser = 'unknown';
  let version = 'unknown';
  
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    version = match ? match[1] : 'unknown';
  }
  
  // Detect platform
  let platform = 'unknown';
  if (userAgent.includes('Windows')) platform = 'Windows';
  else if (userAgent.includes('Mac')) platform = 'macOS';
  else if (userAgent.includes('Linux')) platform = 'Linux';
  else if (userAgent.includes('Android')) platform = 'Android';
  else if (userAgent.includes('iOS')) platform = 'iOS';
  
  // Detect mobile
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  return { browser, version, platform, mobile };
}

/**
 * Get screen resolution information
 */
export function getScreenInfo(): {
  width: number;
  height: number;
  pixelRatio: number;
} {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, pixelRatio: 1 };
  }
  
  return {
    width: window.screen.width,
    height: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1
  };
}

/**
 * Get viewport information
 */
export function getViewportInfo(): {
  width: number;
  height: number;
} {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Create enhanced metadata with additional context
 */
export function collectEnhancedMetadata(): FeedbackMetadata & {
  browser: ReturnType<typeof getBrowserInfo>;
  screen: ReturnType<typeof getScreenInfo>;
  viewport: ReturnType<typeof getViewportInfo>;
  isIframe: boolean;
  domain: string;
} {
  const basic = collectPageMetadata();
  
  return {
    ...basic,
    browser: getBrowserInfo(),
    screen: getScreenInfo(),
    viewport: getViewportInfo(),
    isIframe: isInIframe(),
    domain: getCurrentDomain()
  };
}