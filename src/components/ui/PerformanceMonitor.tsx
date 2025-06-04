import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Monitor, Zap, Eye } from 'lucide-react'

interface PerformanceStats {
  fps: number
  memory: number
  loadTime: number
  renderTime: number
}

const PerformanceMonitor = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    renderTime: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const monitorRef = useRef<HTMLDivElement>(null)

  // FPS calculation
  useEffect(() => {
    let animationId: number

    const calculateFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
        
        setStats(prev => ({
          ...prev,
          fps: fps,
          memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
          renderTime: currentTime - lastTime.current
        }))
        
        frameCount.current = 0
        lastTime.current = currentTime
      }
      
      animationId = requestAnimationFrame(calculateFPS)
    }

    calculateFPS()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Load time calculation
  useEffect(() => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    setStats(prev => ({ ...prev, loadTime: Math.round(loadTime) }))
  }, [])

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Animation on toggle
  useEffect(() => {
    if (monitorRef.current) {
      if (isVisible) {
        gsap.fromTo(monitorRef.current,
          { opacity: 0, x: 50, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        )
      } else {
        gsap.to(monitorRef.current, {
          opacity: 0, x: 50, scale: 0.9, duration: 0.2
        })
      }
    }
  }, [isVisible])

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return 'text-green-400'
    if (value >= thresholds[0]) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-400'
    if (memory < 100) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!isVisible) return null

  return (
    <div 
      ref={monitorRef}
      className="fixed bottom-4 right-4 z-[999] bg-black/80 backdrop-blur-sm border border-gray-700 
                 rounded-lg p-3 font-mono text-xs text-white shadow-xl"
    >
      <div className="flex items-center mb-2 space-x-2">
        <Monitor className="w-4 h-4 text-blue-400" />
        <span className="font-semibold">Performance</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-1.5">
        {/* FPS */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>FPS:</span>
          </div>
          <span className={getPerformanceColor(stats.fps, [30, 50])}>
            {stats.fps}
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-sm" />
            <span>Memory:</span>
          </div>
          <span className={getMemoryColor(stats.memory)}>
            {stats.memory}MB
          </span>
        </div>

        {/* Load Time */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3 text-blue-400" />
            <span>Load:</span>
          </div>
          <span className={getPerformanceColor(stats.loadTime, [2000, 1000])}>
            {stats.loadTime}ms
          </span>
        </div>

        {/* Render Time */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <span>Render:</span>
          </div>
          <span className={getPerformanceColor(1000 / stats.renderTime, [30, 50])}>
            {Math.round(stats.renderTime)}ms
          </span>
        </div>
      </div>

      {/* Performance Tips */}
      {(stats.fps < 30 || stats.memory > 100) && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-orange-400 text-xs">
            ⚠️ Performance issues detected
          </div>
        </div>
      )}

      {/* Shortcut hint */}
      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400 text-xs">
        Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

export default PerformanceMonitor
