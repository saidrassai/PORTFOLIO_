import { useContext, createContext } from 'react'

// Physics context to track availability
export const PhysicsAvailableContext = createContext<boolean>(false)

// Hook to safely check if physics is available
export const usePhysicsAvailable = () => {
  return useContext(PhysicsAvailableContext)
}
