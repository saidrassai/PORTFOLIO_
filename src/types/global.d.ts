// Global type declarations for the project

declare global {
  interface Window {
    // Analytics disabled - only keep essential types
    track3DSceneLoad?: (startTime: number) => void;
  }
}

// Web Vitals types
export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: any[];
  id: string;
  navigationType: string;
}

export {};
