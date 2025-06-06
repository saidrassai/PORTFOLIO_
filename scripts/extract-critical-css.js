/**
 * Enhanced Critical CSS Extraction Script with Puppeteer
 * Extracts and inlines critical CSS for above-the-fold content
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VIEWPORT_SIZES = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' }
]

let previewServer = null

const startPreviewServer = () => {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting preview server...')
    
    previewServer = spawn('npm', ['run', 'preview'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })
    
    let output = ''
    previewServer.stdout.on('data', (data) => {
      output += data.toString()
      if (output.includes('http://localhost:4173')) {
        console.log('✅ Preview server started on http://localhost:4173')
        resolve('http://localhost:4173')
      }
    })
    
    previewServer.stderr.on('data', (data) => {
      console.log('Preview server stderr:', data.toString())
    })
    
    previewServer.on('error', reject)
    
    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Preview server failed to start within 30 seconds'))
    }, 30000)
  })
}

const stopPreviewServer = () => {
  if (previewServer) {
    console.log('🛑 Stopping preview server...')
    previewServer.kill()
    previewServer = null
  }
}

const extractCriticalCSS = async () => {
  console.log('🔍 Extracting critical CSS with Puppeteer...')
  
  let browser, serverUrl
  
  try {
    // Start preview server
    serverUrl = await startPreviewServer()
    
    // Launch headless browser with optimization flags
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    })

    const allUsedCSS = new Set()
    
    // Extract critical CSS for different viewports
    for (const viewport of VIEWPORT_SIZES) {
      console.log(`📱 Analyzing ${viewport.name} (${viewport.width}x${viewport.height})...`)
      
      const page = await browser.newPage()
      
      // Set viewport
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1
      })

      // Start CSS coverage analysis
      await page.coverage.startCSSCoverage()

      // Navigate to the page
      await page.goto(serverUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Wait for lazy-loaded content and animations
      await page.waitForTimeout(3000)
      
      // Simulate user interaction to capture critical states
      await page.evaluate(() => {
        // Scroll to capture above-the-fold content
        window.scrollTo(0, window.innerHeight * 0.3)
      })
      
      await page.waitForTimeout(1000)
      
      // Return to top
      await page.evaluate(() => {
        window.scrollTo(0, 0)
      })
      
      await page.waitForTimeout(1000)

      // Stop coverage and analyze
      const cssCoverage = await page.coverage.stopCSSCoverage()
      
      // Extract used CSS rules
      for (const entry of cssCoverage) {
        if (entry.url && (entry.url.includes('assets/index') && entry.url.endsWith('.css'))) {
          // Extract used portions of CSS
          for (const range of entry.ranges) {
            const usedPortion = entry.text.slice(range.start, range.end)
            if (usedPortion.trim()) {
              allUsedCSS.add(usedPortion.trim())
            }
          }
        }
      }
      
      await page.close()
    }

    await browser.close()
    
    // Combine all used CSS
    let criticalCSS = Array.from(allUsedCSS).join('\n')
    
    // Add essential base styles if missing
    const essentialStyles = `
      html{scroll-behavior:smooth}
      body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      .min-h-screen{min-height:100vh}
      .relative{position:relative}
      .overflow-hidden{overflow:hidden}
      .flex{display:flex}
      .items-center{align-items:center}
      .justify-center{justify-content:center}
      .text-center{text-align:center}
      .text-white{color:rgb(255 255 255)}
      .bg-gray-900{background-color:rgb(17 24 39)}
      .bg-black{background-color:rgb(0 0 0)}
    `
    
    if (!criticalCSS.includes('scroll-behavior')) {
      criticalCSS = essentialStyles + criticalCSS
    }    
    
    // Enhanced CSS minification
    const minifiedCSS = criticalCSS
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
    
    // Ensure styles directory exists
    const stylesDir = path.join(__dirname, '../src/styles')
    if (!fs.existsSync(stylesDir)) {
      fs.mkdirSync(stylesDir, { recursive: true })
    }
    
    // Write critical CSS to file
    const criticalCSSPath = path.join(stylesDir, 'critical-extracted.css')
    fs.writeFileSync(criticalCSSPath, minifiedCSS)
    
    console.log(`✅ Critical CSS extracted: ${minifiedCSS.length} bytes`)
    console.log(`📁 Saved to: ${criticalCSSPath}`)
    
    // Generate inline version for HTML
    const inlineCSSPath = path.join(stylesDir, 'critical-inline.css')
    fs.writeFileSync(inlineCSSPath, minifiedCSS)
    
    stopPreviewServer()
    
    return minifiedCSS
    
  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error)
    stopPreviewServer()
    
    // Fallback to basic critical CSS
    console.log('🔄 Falling back to basic critical CSS...')
    return await generateBasicCriticalCSS()
  }
}

const generateBasicCriticalCSS = async () => {
  console.log('📝 Generating basic critical CSS...')
  
  const basicCriticalCSS = `
html{scroll-behavior:smooth}
body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:rgb(0 0 0);color:rgb(255 255 255)}
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
.min-h-screen{min-height:100vh}
.relative{position:relative}
.fixed{position:fixed}
.absolute{position:absolute}
.top-0{top:0px}
.left-0{left:0px}
.z-50{z-index:50}
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}
.text-center{text-align:center}
.text-white{color:rgb(255 255 255)}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.font-bold{font-weight:700}
.bg-black{background-color:rgb(0 0 0)}
.bg-gray-900{background-color:rgb(17 24 39)}
.bg-opacity-80{--tw-bg-opacity:0.8}
.backdrop-blur-md{--tw-backdrop-blur:blur(12px);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}
.overflow-hidden{overflow:hidden}
.w-full{width:100%}
.h-full{height:100%}
.p-4{padding:1rem}
.px-4{padding-left:1rem;padding-right:1rem}
.py-2{padding-top:0.5rem;padding-bottom:0.5rem}
.space-x-6>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1.5rem * var(--tw-space-x-reverse));margin-left:calc(1.5rem * calc(1 - var(--tw-space-x-reverse)))}
.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.hover\\:text-blue-400:hover{color:rgb(96 165 250)}
`.trim()

  // Save basic critical CSS
  const stylesDir = path.join(__dirname, '../src/styles')
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true })
  }
  
  const criticalCSSPath = path.join(stylesDir, 'critical-extracted.css')
  fs.writeFileSync(criticalCSSPath, basicCriticalCSS)
  
  console.log(`✅ Basic critical CSS generated: ${basicCriticalCSS.length} bytes`)
  console.log(`📁 Saved to: ${criticalCSSPath}`)
  
  return basicCriticalCSS
}

const updateIndexHTML = (criticalCSS) => {
  console.log('📝 Updating index.html with critical CSS...')
  
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
    console.log('✅ index.html updated with critical CSS')
    
  } catch (error) {
    console.error('❌ Error updating index.html:', error)
    throw error
  }
}

// Main execution with better error handling
const main = async () => {
  console.log('🚀 Starting critical CSS optimization...')
  
  try {
    // Check if dist folder exists, if not build the project
    const distPath = path.join(__dirname, '../dist')
    if (!fs.existsSync(distPath)) {
      console.log('📦 Building project first...')
      await new Promise((resolve, reject) => {
        const buildProcess = spawn('npm', ['run', 'build'], {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        })
        
        buildProcess.on('close', (code) => {
          if (code === 0) resolve()
          else reject(new Error(`Build failed with code ${code}`))
        })
      })
    }
    
    // Extract critical CSS
    const criticalCSS = await extractCriticalCSS()
    
    // Update index.html
    updateIndexHTML(criticalCSS)
    
    console.log('🎉 Critical CSS optimization complete!')
    console.log('💡 Critical CSS has been extracted and inlined in index.html')
    console.log(`📊 Critical CSS size: ${criticalCSS.length} bytes`)
    
  } catch (error) {
    console.error('❌ Critical CSS optimization failed:', error)
    stopPreviewServer()
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...')
  stopPreviewServer()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  stopPreviewServer()
  process.exit(0)
})

// Run the script
main().catch(console.error)

export { extractCriticalCSS, updateIndexHTML }
