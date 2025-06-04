export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  link?: string;
  technologies: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ThreeSceneProps {
  className?: string;
  visible?: boolean;
}

export interface SectionProps {
  className?: string;
  id?: string;
}

// GSAP Timeline types
export interface GSAPTimelineConfig {
  repeat?: number;
  yoyo?: boolean;
  ease?: string;
  duration?: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface ScrollPosition {
  x: number;
  y: number;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}
