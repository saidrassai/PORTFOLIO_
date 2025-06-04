<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Modern Minimalist Portfolio - Copilot Instructions

## Project Context
This is a modern minimalist single-page application built with:
- **Vite + React + TypeScript** (Fast development setup)
- **React Three Fiber** (3D graphics and interactions)
- **GSAP** (Smooth animations and transitions)  
- **Tailwind CSS** (Utility-first CSS framework)

## Design Philosophy
- **Minimalist aesthetic**: Clean typography, generous whitespace
- **Subtle animations**: Smooth, purposeful motion design
- **3D elements**: Interactive but not overwhelming
- **Performance focused**: Fast loading, smooth interactions
- **Mobile responsive**: Works across all devices

## Code Style Guidelines
- Use TypeScript with strict typing
- Prefer functional components with hooks
- Keep components small and focused
- Use Tailwind classes for styling
- Implement proper error boundaries
- Follow React best practices (memo, useMemo, useCallback)

## Animation Guidelines  
- **Timing**: Use consistent easing (ease-out for entrances, ease-in for exits)
- **Duration**: 0.3s-0.6s for UI, 1s-2s for hero animations
- **Performance**: Prefer transform/opacity over layout properties
- **Accessibility**: Respect prefers-reduced-motion

## 3D Scene Guidelines
- **Complexity**: Keep models lightweight (<1MB total)
- **Lighting**: Soft, realistic lighting setup
- **Materials**: PBR materials for realism
- **Performance**: Target 60fps on desktop, 30fps mobile

## File Organization
- `src/components/ui/` - Reusable UI components
- `src/components/3d/` - Three.js/R3F components
- `src/components/sections/` - Page sections
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/styles/` - Global styles and themes
- `src/types/` - TypeScript type definitions

## Key Dependencies
- `@react-three/fiber` - Core 3D rendering
- `@react-three/drei` - Useful 3D helpers
- `gsap` - Animation library
- `framer-motion` - Complementary animations
- `lucide-react` - Modern icon library
- `tailwindcss` - Utility-first CSS

## Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- 3D Frame Rate: 60fps desktop, 30fps mobile

When generating code, prioritize clean, performant, and accessible solutions that align with the minimalist design aesthetic.
