import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const PageLoader = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline()

    // Animate progress bar
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function() {
        const currentProgress = Math.round(this.progress() * 100)
        setProgress(currentProgress)
      }
    })
    // Fade out loader
    .to([loaderRef.current, textRef.current], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    // Slide loader out
    .to(loaderRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: onLoadComplete
    })

    return () => {
      tl.kill()
    }
  }, [onLoadComplete])

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <div className="text-center">
        <div ref={textRef} className="mb-8">
          <h2 className="text-2xl font-light tracking-wide mb-2">Changelog</h2>
          <p className="text-neutral-600 text-sm">{progress}%</p>
        </div>
        
        <div className="w-64 h-0.5 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-neutral-900 rounded-full w-0"
          />
        </div>
      </div>
    </div>
  )
}

export default PageLoader
