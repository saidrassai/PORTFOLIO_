import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualScrollContainer<T>({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  overscan = 3,
  className = ''
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])
  
  // Handle scroll with throttling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)
  }, [])
  
  // Total height of all items
  const totalHeight = items.length * itemHeight
  
  // Generate visible items
  const visibleItems = useMemo(() => {
    const result = []
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (items[i]) {
        result.push({
          index: i,
          item: items[i],
          top: i * itemHeight
        })
      }
    }
    return result
  }, [items, visibleRange, itemHeight])
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Virtual spacer for total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, index, true)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Hook for virtual scrolling with intersection observer
export function useVirtualScroll<T>(
  items: T[],
  containerRef: React.RefObject<HTMLDivElement>,
  itemHeight: number,
  overscan: number = 3
) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: Math.min(10, items.length) })
  const [scrollTop, setScrollTop] = useState(0)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef])
  
  useEffect(() => {
    const containerHeight = containerRef.current?.clientHeight || 600
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    setVisibleRange({ start: startIndex, end: endIndex })
  }, [scrollTop, itemHeight, items.length, overscan])
  
  return {
    visibleRange,
    totalHeight: items.length * itemHeight,
    scrollTop
  }
}
