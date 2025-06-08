import React from 'react'
import { useVideoInView } from '../../hooks/useVideoInView'

interface VideoHeroProps {
  className?: string
  introVideoSrc?: string
  loopVideoSrc?: string
  posterSrc?: string
}

const VideoHero: React.FC<VideoHeroProps> = ({
  className = '',
  introVideoSrc = '/video/home.webm',
  loopVideoSrc = '/video/home_loop.webm',
  posterSrc = '/images/hero-poster.jpg'
}) => {  const {
    introVideoRef,
    loopVideoRef,
    containerRef,
    isLoaded,
    hasError,
    showLoop
  } = useVideoInView({
    threshold: 0.3,
    rootMargin: '0px',
    preload: 'metadata'
  })

  return (    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`absolute inset-0 overflow-hidden bg-slate-900 ${className}`}
    >
      {/* Futuristic animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>      {/* Intro Video Element */}
      <video
        ref={introVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded && !hasError && !showLoop ? 'opacity-100' : 'opacity-0'
        }`}
        poster={posterSrc}
        muted
        playsInline
        preload="metadata"
      >
        <source src={introVideoSrc} type="video/webm" />
        <source src={introVideoSrc.replace('.webm', '.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Additional dark overlay specifically for intro video to unify background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 transition-opacity duration-500 ${
          isLoaded && !hasError && !showLoop ? 'opacity-100' : 'opacity-0'
        }`}
      />{/* Loop Video Element */}
      <video
        ref={loopVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          showLoop && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        loop
        preload="metadata"
        onLoadedData={() => console.log('🎞️ Loop video loaded:', loopVideoSrc)}        onError={(e) => console.error('❌ Loop video error:', e)}
      >
        <source src={loopVideoSrc} type="video/webm" />
        <source src={loopVideoSrc.replace('.webm', '.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      )}      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-black/20" />
          {/* Futuristic animated background pattern as fallback */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      )}      {/* Overlay for better text readability and background unification */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}

export default VideoHero
