import { useRef, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'

interface PerformanceStats {
  fps: number
  frameTime: number
  memoryUsage?: number
  drawCalls?: number
  triangles?: number
}

interface PerformanceMonitorProps {
  onStatsUpdate?: (stats: PerformanceStats) => void
  showOverlay?: boolean
  enableMemoryTracking?: boolean
}

const PerformanceMonitor = memo(({ 
  onStatsUpdate, 
  showOverlay = false, 
  enableMemoryTracking = true 
}: PerformanceMonitorProps) => {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const frameTimes = useRef<number[]>([])
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  })

  useFrame((state) => {
    const now = performance.now()
    const deltaTime = now - lastTime.current
    
    frameCount.current++
    frameTimes.current.push(deltaTime)
    
    // Keep only the last 60 frame times for rolling average
    if (frameTimes.current.length > 60) {
      frameTimes.current.shift()
    }
    
    // Update stats every 60 frames (roughly once per second at 60fps)
    if (frameCount.current % 60 === 0) {
      const avgFrameTime = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
      const fps = Math.round(1000 / avgFrameTime)
      
      let memoryUsage = 0
      if (enableMemoryTracking && 'memory' in performance) {
        const memory = (performance as any).memory
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      }
      
      // Get render info if available
      const renderer = state.gl
      const info = renderer.info
      const drawCalls = info.render?.calls || 0
      const triangles = info.render?.triangles || 0
      
      const newStats: PerformanceStats = {
        fps,
        frameTime: Math.round(avgFrameTime * 100) / 100,
        memoryUsage,
        drawCalls,
        triangles,
      }
      
      setStats(newStats)
      
      // Call callback if provided
      if (onStatsUpdate) {
        onStatsUpdate(newStats)
      }
      
      // Log performance warnings in development
      if (import.meta.env.DEV) {
        if (fps < 30) {
          console.warn(`🐌 Low FPS detected: ${fps}fps (${avgFrameTime}ms frame time)`)
        }
        if (memoryUsage > 100) {
          console.warn(`💾 High memory usage: ${memoryUsage}MB`)
        }
        if (drawCalls > 100) {
          console.warn(`🎨 High draw calls: ${drawCalls}`)
        }
      }
    }
    
    lastTime.current = now
  })

  // Performance overlay component
  const PerformanceOverlay = () => {
    if (!showOverlay) return null
    
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg font-mono text-sm z-50">
        <div className="space-y-1">
          <div className={`${stats.fps < 30 ? 'text-red-400' : stats.fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
            FPS: {stats.fps}
          </div>
          <div>Frame: {stats.frameTime}ms</div>
          {stats.memoryUsage !== undefined && (
            <div className={stats.memoryUsage > 100 ? 'text-yellow-400' : ''}>
              Memory: {stats.memoryUsage}MB
            </div>
          )}
          <div>Draws: {stats.drawCalls}</div>
          <div>Tris: {stats.triangles?.toLocaleString()}</div>
        </div>
      </div>
    )
  }

  return showOverlay ? <PerformanceOverlay /> : null
})

PerformanceMonitor.displayName = 'PerformanceMonitor'

export default PerformanceMonitor
export type { PerformanceStats }
