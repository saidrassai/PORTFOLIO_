# Modern Minimalist Portfolio

A modern minimalist single-page application built with Vite, React, TypeScript, featuring GSAP animations and React Three Fiber 3D graphics.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Documentation

Comprehensive guides are available in the [`docs/`](./docs/) folder:

- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[Build Guide](./docs/BUILD_GUIDE.md)** - Production build configuration
- **[MIME Type Fix](./docs/MIME_TYPE_FIX.md)** - Solving JavaScript module loading issues
- **[Interaction Features](./docs/INTERACTION_FEATURES.md)** - 3D interactions and animations
- **[Production Guide](./docs/PRODUCTION_GUIDE.md)** - Performance optimizations

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **3D Graphics**: React Three Fiber, Three.js, @react-three/drei
- **Animations**: GSAP, Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3d/              # Three.js/R3F components
│   │   └── Scene3D.tsx
│   ├── sections/        # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   └── Contact.tsx
│   └── ui/              # Reusable UI components
│       ├── Navigation.tsx
│       └── LoadingSpinner.tsx
├── hooks/               # Custom React hooks
│   └── useGSAP.ts
├── utils/               # Utility functions
│   └── animations.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── styles/              # Global styles
└── assets/              # Static assets
```

## 🎨 Design Philosophy

- **Minimalist Aesthetic**: Clean typography, generous whitespace
- **Subtle Animations**: Smooth, purposeful motion design
- **3D Elements**: Interactive but not overwhelming
- **Performance First**: Fast loading, smooth interactions
- **Mobile Responsive**: Works seamlessly across all devices

## 🎭 Animation Guidelines

- **Timing**: Consistent easing (ease-out for entrances, ease-in for exits)
- **Duration**: 0.3s-0.6s for UI, 1s-2s for hero animations
- **Performance**: Prefer transform/opacity over layout properties
- **Accessibility**: Respects `prefers-reduced-motion`

## 🎮 3D Scene Guidelines

- **Complexity**: Lightweight models (<1MB total)
- **Lighting**: Soft, realistic lighting setup
- **Materials**: PBR materials for realism
- **Performance**: Target 60fps on desktop, 30fps mobile

## 📱 Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- 3D Frame Rate: 60fps desktop, 30fps mobile

## 🎯 Development Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Install and configure dependencies
- [x] Set up project structure
- [x] Create basic components and layout

### Phase 2: 3D Scene Development ✅
- [x] Basic Three.js scene setup
- [x] Floating geometry and lighting
- [x] Canvas integration with React

### Phase 3: GSAP Animation System ✅
- [x] Animation utilities and hooks
- [x] Scroll-triggered animations
- [x] Hero section animations

### Phase 4: Core Sections ✅
- [x] Hero section with typography animations
- [x] About section with scroll effects
- [x] Portfolio grid with project cards
- [x] Contact form with validation

### Phase 5: Typography & Design System
- [ ] Custom typography scale
- [ ] Consistent spacing system
- [ ] Color palette refinement
- [ ] Component variants and states

### Phase 6: Advanced 3D Development
- [ ] Interactive 3D models
- [ ] Mouse-following effects
- [ ] Particle systems
- [ ] Advanced materials and shaders

### Phase 7: Advanced GSAP Animations
- [ ] Complex timeline animations
- [ ] Morphing text effects
- [ ] Parallax scrolling
- [ ] Page transitions

### Phase 8: Responsive Optimization
- [ ] Mobile-specific animations
- [ ] Touch interactions
- [ ] Performance optimization
- [ ] Cross-browser testing

### Phase 9: Content & Polish
- [ ] Real portfolio content
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Error boundaries

### Phase 10: Performance & Deployment
- [ ] Bundle optimization
- [ ] Lazy loading
- [ ] PWA features
- [ ] Deploy to production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the clean aesthetic of [Recapa After Use](https://www.recapafteruse.co.uk/)
- Built with amazing open-source libraries and tools
- Special thanks to the React Three Fiber and GSAP communities
