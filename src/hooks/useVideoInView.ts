import { useRef, useEffect, useState, useCallback } from 'react'

interface UseVideoInViewOptions {
  threshold?: number
  rootMargin?: string
  introVideoSrc?: string
  loopVideoSrc?: string
  preload?: 'none' | 'metadata' | 'auto'
}

interface VideoInViewReturn {
  introVideoRef: React.RefObject<HTMLVideoElement | null>
  loopVideoRef: React.RefObject<HTMLVideoElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isInView: boolean
  isIntroPlaying: boolean
  isLoopPlaying: boolean
  isLoaded: boolean
  hasError: boolean
  showLoop: boolean
  playIntroVideo: () => Promise<void>
  pauseVideos: () => void
}

export const useVideoInView = (
  options: UseVideoInViewOptions = {}
): VideoInViewReturn => {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    preload = 'metadata'
  } = options
    const introVideoRef = useRef<HTMLVideoElement>(null)
  const loopVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isInView, setIsInView] = useState(false)
  const [isIntroPlaying, setIsIntroPlaying] = useState(false)
  const [isLoopPlaying, setIsLoopPlaying] = useState(false)
  const [introLoaded, setIntroLoaded] = useState(false)
  const [loopLoaded, setLoopLoaded] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [introHasPlayed, setIntroHasPlayed] = useState(false)
  const [showLoop, setShowLoop] = useState(false)
  // Video event handlers
  const handleIntroLoadedData = useCallback(() => {
    setIntroLoaded(true)
    setIsLoaded(true) // Keep for backwards compatibility    setHasError(false)
  }, [])
  
  const handleLoopLoadedData = useCallback(() => {
    setLoopLoaded(true)
  }, [])

  const handleIntroError = useCallback(() => {
    setHasError(true)
    const video = introVideoRef.current
    if (video) {
      console.error('Intro video failed to load:', video.error)
    }
  }, []);
  const handleIntroEnded = useCallback(() => {
    setIsIntroPlaying(false)
    setIntroHasPlayed(true)
    
    // Immediate transition to loop video
    setShowLoop(true)
    
    // Start loop video immediately
    const loopVideo = loopVideoRef.current
    if (loopVideo) {
      // Reset and play
      loopVideo.currentTime = 0
      loopVideo.play().then(() => {
        setIsLoopPlaying(true)
      }).catch((error) => {
        console.error('Failed to play loop video:', error)
        // Try loading the video first
        loopVideo.load()
        setTimeout(() => {
          loopVideo.play().catch(console.error)
        }, 500)
      })
    }
  }, [isInView, loopLoaded])

  const playIntroVideo = useCallback(async () => {
    const introVideo = introVideoRef.current
    if (!introVideo || hasError || introHasPlayed) return

    try {
      setIsIntroPlaying(true)
      await introVideo.play()
    } catch (error) {
      console.error('Failed to play intro video:', error)
      setHasError(true)
      setIsIntroPlaying(false)
    }
  }, [hasError, introHasPlayed])

  const pauseVideos = useCallback(() => {
    const introVideo = introVideoRef.current
    const loopVideo = loopVideoRef.current
    
    if (introVideo) {
      introVideo.pause()
      setIsIntroPlaying(false)
    }
    
    if (loopVideo) {
      loopVideo.pause()
      setIsLoopPlaying(false)
    }
  }, [])

  // Intersection Observer for auto-play
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsInView(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          if (!introHasPlayed && introLoaded) {
            playIntroVideo()
          } else if (introHasPlayed && showLoop) {
            const loopVideo = loopVideoRef.current
            if (loopVideo && !isLoopPlaying) {
              loopVideo.currentTime = 0
              loopVideo.play().then(() => {
                setIsLoopPlaying(true)
              }).catch((error) => {
                console.error('Failed to play loop video on intersection:', error)
              })
            }
          }        } else {
          pauseVideos()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [introLoaded, loopLoaded, hasError, introHasPlayed, showLoop, isLoopPlaying, playIntroVideo, pauseVideos, threshold, rootMargin])

  // Video setup effect
  useEffect(() => {
    const introVideo = introVideoRef.current
    const loopVideo = loopVideoRef.current
    
    if (!introVideo || !loopVideo) return

    // Set intro video properties
    introVideo.muted = true
    introVideo.playsInline = true
    introVideo.preload = preload
    introVideo.loop = false    // Set loop video properties
    loopVideo.muted = true
    loopVideo.playsInline = true
    loopVideo.preload = 'metadata' // Always preload loop video
    loopVideo.loop = true

    // Force load the loop video early
    loopVideo.load()// Add event listeners for intro video
    introVideo.addEventListener('loadeddata', handleIntroLoadedData)
    introVideo.addEventListener('error', handleIntroError)
    introVideo.addEventListener('ended', handleIntroEnded)
    introVideo.addEventListener('play', () => setIsIntroPlaying(true))
    introVideo.addEventListener('pause', () => setIsIntroPlaying(false))    // Add event listeners for loop video
    loopVideo.addEventListener('loadeddata', handleLoopLoadedData)
    loopVideo.addEventListener('play', () => setIsLoopPlaying(true))
    loopVideo.addEventListener('pause', () => setIsLoopPlaying(false))
    loopVideo.addEventListener('error', (e) => {
      console.error('Loop video error:', e)
    })

    return () => {
      introVideo.removeEventListener('loadeddata', handleIntroLoadedData)
      introVideo.removeEventListener('error', handleIntroError)
      introVideo.removeEventListener('ended', handleIntroEnded)
      introVideo.removeEventListener('play', () => setIsIntroPlaying(true))
      introVideo.removeEventListener('pause', () => setIsIntroPlaying(false))
      
      loopVideo.removeEventListener('loadeddata', handleLoopLoadedData)
      loopVideo.removeEventListener('play', () => setIsLoopPlaying(true))
      loopVideo.removeEventListener('pause', () => setIsLoopPlaying(false))
    }
  }, [preload, handleIntroLoadedData, handleLoopLoadedData, handleIntroError, handleIntroEnded])
  
  return {
    introVideoRef,
    loopVideoRef,
    containerRef,
    isInView,
    isIntroPlaying,
    isLoopPlaying,
    isLoaded,
    hasError,
    showLoop,
    playIntroVideo,
    pauseVideos
  }
}
