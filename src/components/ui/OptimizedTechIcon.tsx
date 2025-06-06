import React, { memo } from 'react';

interface OptimizedTechIconProps {
  /** Icon name (without extension) */
  name: string;
  /** Alt text for accessibility */
  alt: string;
  /** Size variant - affects which optimized images to load */
  size?: 'small' | 'medium' | 'large';
  /** Additional CSS classes */
  className?: string;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
}

/**
 * Optimized tech icon component that uses modern image formats (AVIF, WebP) with PNG fallback.
 * Automatically selects the best format based on browser support and the appropriate size.
 */
const OptimizedTechIcon: React.FC<OptimizedTechIconProps> = memo(({
  name,
  alt,
  size = 'medium',
  className = '',
  loading = 'lazy'
}) => {
  const basePath = '/tech-icons-optimized';
  
  // Generate sources for different formats
  const generateSources = () => {
    const sizes = {
      small: 32,
      medium: 48,
      large: 64
    };
    
    const pixelSize = sizes[size];
    
    return {
      avif: `${basePath}/${name}-${size}.avif`,
      webp: `${basePath}/${name}-${size}.webp`,
      png: `${basePath}/${name}-${size}.png`,
      width: pixelSize,
      height: pixelSize
    };
  };

  const { avif, webp, png, width, height } = generateSources();

  return (
    <picture className={`inline-block ${className}`}>
      {/* AVIF - best compression, modern browsers */}
      <source srcSet={avif} type="image/avif" />
      
      {/* WebP - good compression, widely supported */}
      <source srcSet={webp} type="image/webp" />
      
      {/* PNG fallback - universal support */}
      <img
        src={png}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className="block max-w-full h-auto"
        style={{
          // Prevent layout shift
          aspectRatio: '1 / 1'
        }}
        onError={(e) => {
          // Fallback to original SVG if optimized images fail
          const target = e.target as HTMLImageElement;
          target.src = `/tech-icons/${name}.svg`;
        }}
      />
    </picture>
  );
});

OptimizedTechIcon.displayName = 'OptimizedTechIcon';

export default OptimizedTechIcon;
