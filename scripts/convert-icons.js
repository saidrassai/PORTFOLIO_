import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../public/tech-icons');
const OUTPUT_DIR = join(__dirname, '../public/tech-icons-optimized');

// Icon sizes for different use cases
const SIZES = {
  small: 32,   // For mobile and compact views
  medium: 48,  // Default size
  large: 64    // For high-resolution displays
};

// Quality settings
const WEBP_QUALITY = 85;
const AVIF_QUALITY = 80;

async function ensureDirectory(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function convertSvgToFormats(inputPath, outputDir, fileName) {
  const baseName = basename(fileName, extname(fileName));
  
  console.log(`Converting ${fileName}...`);
  
  try {
    // Create size variants for each format
    for (const [sizeName, size] of Object.entries(SIZES)) {
      // Convert to PNG first (from SVG)
      const pngBuffer = await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: 'transparent'
        })
        .png()
        .toBuffer();

      // Generate WebP from PNG buffer
      await sharp(pngBuffer)
        .webp({ quality: WEBP_QUALITY, alphaQuality: 100 })
        .toFile(join(outputDir, `${baseName}-${sizeName}.webp`));

      // Generate AVIF from PNG buffer
      await sharp(pngBuffer)
        .avif({ quality: AVIF_QUALITY })
        .toFile(join(outputDir, `${baseName}-${sizeName}.avif`));

      // Also save optimized PNG as fallback
      await sharp(pngBuffer)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(join(outputDir, `${baseName}-${sizeName}.png`));
    }
    
    console.log(`✓ Converted ${fileName} to all formats and sizes`);
  } catch (error) {
    console.error(`✗ Failed to convert ${fileName}:`, error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting icon conversion process...\n');
    
    // Ensure output directory exists
    await ensureDirectory(OUTPUT_DIR);
    
    // Read all SVG files from source directory
    const files = await readdir(SOURCE_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    console.log(`Found ${svgFiles.length} SVG files to convert\n`);
    
    // Convert each SVG file
    const promises = svgFiles.map(file => 
      convertSvgToFormats(join(SOURCE_DIR, file), OUTPUT_DIR, file)
    );
    
    await Promise.all(promises);
    
    console.log(`\n✅ Successfully converted ${svgFiles.length} icons!`);
    console.log(`📁 Optimized icons saved to: ${OUTPUT_DIR}`);
    console.log('\nGenerated formats:');
    console.log('  • WebP (modern browsers)');
    console.log('  • AVIF (cutting-edge browsers)'); 
    console.log('  • PNG (fallback)');
    console.log('\nGenerated sizes:');
    console.log('  • Small (32px) - Mobile/compact views');
    console.log('  • Medium (48px) - Default size');
    console.log('  • Large (64px) - High-resolution displays');
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

main();
