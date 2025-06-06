import { useContext, createContext } from 'react'

// Physics context to track availability
export const PhysicsAvailableContext = createContext<boolean>(false)

// Hook to safely check if physics is available
export const usePhysicsAvailable = () => {
  return useContext(PhysicsAvailableContext)
}

// Hook to safely use Rapier only when available
export const useSafeRapier = () => {
  const isPhysicsAvailable = usePhysicsAvailable()
  
  if (!isPhysicsAvailable) {
    return null
  }
  
  try {
    // Dynamic import and use of useRapier hook
    const { useRapier } = require('@react-three/rapier')
    return useRapier()
  } catch {
    return null
  }
}
