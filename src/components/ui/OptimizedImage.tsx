import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
}

const OptimizedImage = ({ src, alt, className = '' }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => setHasError(true)

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-xs ${className}`}>
        {alt}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  )
}

export default OptimizedImage
