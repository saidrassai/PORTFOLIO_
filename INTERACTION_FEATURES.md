# 🎯 3D Ball Cursor Interaction Features

## ✨ **Enhanced Cursor Interactions**

### **1. Collision Detection**
- **Raycasting**: Uses Three.js raycaster for precise cursor-to-sphere collision
- **Real-time Detection**: Constantly checks if cursor ray intersects with each sphere
- **Collision Radius**: Each sphere has a collision boundary based on its scale

### **2. Hit Response**
- **Impulse Physics**: When cursor "hits" a ball, it applies force in ray direction
- **Visual Feedback**: Hit spheres scale up with a pulsing animation
- **Cooldown**: Prevents multiple hits on the same sphere (0.5s cooldown)
- **Enhanced Damping**: Hit spheres have stronger damping for realistic physics

### **3. Click Interaction**
- **Mouse Click Events**: Click anywhere to push nearby spheres
- **Stronger Force**: Click provides 0.5 force vs 0.3 for cursor hover
- **Precise Targeting**: Click detection uses exact mouse coordinates
- **Immediate Response**: Instant physics response on click

### **4. Advanced Physics**
- **Velocity-based Movement**: Each sphere has persistent velocity
- **Bouncy Boundaries**: Spheres bounce off screen edges with proper physics
- **Attraction vs Repulsion**: Normal attraction when not hit, repulsion when hit
- **Realistic Damping**: Different damping for hit vs normal state

### **5. Visual Effects**
- **Hit Animation**: Pulsing scale effect when sphere is hit
- **Smooth Transitions**: All movements use smooth interpolation
- **Dynamic Scaling**: Hit spheres grow/shrink with sine wave animation
- **High-res Geometry**: 64x64 segments for perfectly smooth spheres

## 🎮 **How to Interact**

1. **Move Cursor**: Spheres follow your mouse cursor
2. **Hover Over Spheres**: They get pushed away when cursor gets close
3. **Click on Spheres**: Strong impulse pushes them in click direction
4. **Watch Physics**: Spheres bounce off boundaries and slow down naturally

## 🔧 **Technical Implementation**

- **Raycaster Collision**: `raycaster.ray.distanceToPoint(spherePos) < radius`
- **Click Detection**: Event listeners on canvas element
- **Force Application**: Vector math for realistic physics
- **Performance**: Optimized with instanced rendering for 15 spheres at 60fps
