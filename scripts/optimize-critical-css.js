/**
 * Alternative Critical CSS Optimization Script
 * Manual critical CSS optimization without Puppeteer dependency
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Manual critical CSS rules for above-the-fold content
 * These are the essential styles needed for initial render
 */
const CRITICAL_CSS_RULES = `
/* Critical base styles */
html{scroll-behavior:smooth;height:100%}
body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:#000;color:#333;min-height:100vh}

/* Layout essentials */
.min-h-screen{min-height:100vh}
.relative{position:relative}
.absolute{position:absolute}
.fixed{position:fixed}
.overflow-hidden{overflow:hidden}
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.text-center{text-align:center}
.mx-auto{margin-left:auto;margin-right:auto}
.w-full{width:100%}
.h-full{height:100%}

/* Navigation critical styles */
.top-0{top:0}
.left-0{left:0}
.right-0{right:0}
.z-50{z-index:50}
.bg-white\/90{background-color:rgba(255,255,255,0.9)}
.backdrop-blur-sm{backdrop-filter:blur(4px)}
.border-b{border-bottom-width:1px}
.border-gray-200{border-color:#e5e7eb}

/* Hero section critical styles */
.max-w-4xl{max-width:56rem}
.bg-black\/10{background-color:rgba(0,0,0,0.1)}
.rounded-xl{border-radius:0.75rem}
.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)}
.px-4{padding-left:1rem;padding-right:1rem}
.p-4{padding:1rem}
.font-bold{font-weight:700}
.leading-tight{line-height:1.25}
.text-white{color:#fff}
.drop-shadow-xl{filter:drop-shadow(0 20px 13px rgba(0,0,0,0.03)) drop-shadow(0 8px 5px rgba(0,0,0,0.08))}
.tracking-tight{letter-spacing:-0.025em}

/* Typography critical */
.text-3xl{font-size:1.875rem;line-height:2.25rem}
.text-base{font-size:1rem;line-height:1.5rem}
.mb-4{margin-bottom:1rem}
.mb-8{margin-bottom:2rem}

/* Loading spinner */
.animate-spin{animation:spin 1s linear infinite}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.rounded-full{border-radius:9999px}
.h-12{height:3rem}
.w-12{width:3rem}
.border-b-2{border-bottom-width:2px}
.border-blue-600{border-color:#2563eb}

/* Transitions */
.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.duration-500{transition-duration:500ms}
.opacity-0{opacity:0}
.opacity-100{opacity:1}

/* Responsive design */
@media (min-width:640px){
.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
.sm\\:p-6{padding:1.5rem}
.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}
.sm\\:text-lg{font-size:1.125rem;line-height:1.75rem}
.sm\\:mb-6{margin-bottom:1.5rem}
.sm\\:mb-12{margin-bottom:3rem}
}

/* Canvas container for 3D scene */
canvas{display:block;width:100%;height:100%;position:absolute;top:0;left:0}

/* Performance optimizations */
*{box-sizing:border-box}
img{max-width:100%;height:auto}
`

/**
 * Optimize and inline critical CSS
 */
const optimizeCriticalCSS = () => {
  console.log('🎨 Optimizing critical CSS...')
  
  try {
    // Minify the critical CSS
    const minifiedCSS = CRITICAL_CSS_RULES
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon in rules
      .replace(/\s*{\s*/g, '{') // Clean up brackets
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*>\s*/g, '>')
      .replace(/\s*\+\s*/g, '+')
      .replace(/\s*~\s*/g, '~')
      .trim()
    
    console.log(`✅ Critical CSS optimized: ${minifiedCSS.length} bytes`)
    return minifiedCSS
    
  } catch (error) {
    console.error('❌ Error optimizing critical CSS:', error)
    throw error
  }
}

/**
 * Update index.html with optimized critical CSS
 */
const updateIndexHTML = (criticalCSS) => {
  console.log('📝 Updating index.html with optimized critical CSS...')
  
  try {
    const indexPath = path.join(__dirname, '../index.html')
    let indexContent = fs.readFileSync(indexPath, 'utf8')
    
    // Create backup
    const backupPath = path.join(__dirname, '../index.html.backup')
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, indexContent)
      console.log('💾 Created backup: index.html.backup')
    }
    
    // Replace the existing critical CSS style block
    const styleRegex = /<style>[\s\S]*?<\/style>/
    const newStyleBlock = `<style>${criticalCSS}</style>`
    
    if (styleRegex.test(indexContent)) {
      indexContent = indexContent.replace(styleRegex, newStyleBlock)
      console.log('🔄 Replaced existing critical CSS')
    } else {
      // Insert before closing head tag
      indexContent = indexContent.replace('</head>', `    ${newStyleBlock}\n  </head>`)
      console.log('➕ Added new critical CSS block')
    }
    
    fs.writeFileSync(indexPath, indexContent)
    console.log('✅ index.html updated with optimized critical CSS')
    
    // Save critical CSS to separate file for reference
    const stylesDir = path.join(__dirname, '../src/styles')
    if (!fs.existsSync(stylesDir)) {
      fs.mkdirSync(stylesDir, { recursive: true })
    }
    
    const criticalCSSPath = path.join(stylesDir, 'critical-optimized.css')
    fs.writeFileSync(criticalCSSPath, criticalCSS)
    console.log(`📁 Critical CSS saved to: ${criticalCSSPath}`)
    
  } catch (error) {
    console.error('❌ Error updating index.html:', error)
    throw error
  }
}

/**
 * Additional optimizations for the build
 */
const performAdditionalOptimizations = () => {
  console.log('⚡ Performing additional CSS optimizations...')
  
  try {
    // Check if we can optimize any existing CSS files
    const distPath = path.join(__dirname, '../dist')
    
    if (fs.existsSync(distPath)) {
      console.log('📊 Analyzing build output...')
      
      // Look for CSS files in dist
      const files = fs.readdirSync(distPath, { recursive: true })
      const cssFiles = files.filter(file => 
        typeof file === 'string' && file.endsWith('.css')
      )
      
      console.log(`🔍 Found ${cssFiles.length} CSS files in build:`)
      cssFiles.forEach(file => {
        const filePath = path.join(distPath, file)
        const stats = fs.statSync(filePath)
        console.log(`  - ${file}: ${(stats.size / 1024).toFixed(2)} KB`)
      })
      
      // Calculate total CSS size
      const totalCSSSize = cssFiles.reduce((total, file) => {
        const filePath = path.join(distPath, file)
        const stats = fs.statSync(filePath)
        return total + stats.size
      }, 0)
      
      console.log(`📈 Total CSS size: ${(totalCSSSize / 1024).toFixed(2)} KB`)
      
      if (totalCSSSize > 50 * 1024) { // > 50KB
        console.log('⚠️  CSS bundle is large. Consider further optimization.')
      } else {
        console.log('✅ CSS bundle size is optimal.')
      }
    }
    
  } catch (error) {
    console.warn('⚠️  Could not analyze build output:', error.message)
  }
}

/**
 * Main execution
 */
const main = async () => {
  console.log('🚀 Starting alternative critical CSS optimization...')
  
  try {
    // Optimize critical CSS
    const criticalCSS = optimizeCriticalCSS()
    
    // Update index.html
    updateIndexHTML(criticalCSS)
    
    // Perform additional optimizations
    performAdditionalOptimizations()
    
    console.log('🎉 Critical CSS optimization complete!')
    console.log('💡 Critical CSS has been manually optimized and inlined')
    console.log(`📊 Critical CSS size: ${criticalCSS.length} bytes`)
    console.log('')
    console.log('🔧 Next steps:')
    console.log('  1. Run "npm run build" to create optimized build')
    console.log('  2. Run "npm run perf-test" to validate performance')
    console.log('  3. Check Lighthouse scores for improvements')
    
  } catch (error) {
    console.error('❌ Critical CSS optimization failed:', error)
    process.exit(1)
  }
}

// Export functions for testing
export { optimizeCriticalCSS, updateIndexHTML }

// Run the script
main().catch(console.error)
