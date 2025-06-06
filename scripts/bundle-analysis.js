#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(path.dirname(__dirname), 'dist', 'assets');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundles() {
  console.log('\n🔍 Bundle Analysis Report\n');
  console.log('=' .repeat(60));

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Run npm run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_DIR);
  const bundles = {
    js: [],
    css: [],
    other: []
  };

  let totalSize = 0;

  files.forEach(file => {
    const filePath = path.join(DIST_DIR, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    totalSize += size;

    const fileInfo = {
      name: file,
      size: size,
      formattedSize: formatBytes(size)
    };

    if (file.endsWith('.js')) {
      bundles.js.push(fileInfo);
    } else if (file.endsWith('.css')) {
      bundles.css.push(fileInfo);
    } else {
      bundles.other.push(fileInfo);
    }
  });

  // Sort by size (largest first)
  bundles.js.sort((a, b) => b.size - a.size);
  bundles.css.sort((a, b) => b.size - a.size);
  bundles.other.sort((a, b) => b.size - a.size);

  console.log(`📦 Total Bundle Size: ${formatBytes(totalSize)}\n`);

  // JavaScript Bundles
  console.log('🟨 JavaScript Bundles:');
  console.log('-'.repeat(40));
  bundles.js.forEach((bundle, index) => {
    const percent = ((bundle.size / totalSize) * 100).toFixed(1);
    console.log(`${index + 1}. ${bundle.name}`);
    console.log(`   Size: ${bundle.formattedSize} (${percent}%)`);
    
    // Identify bundle purpose
    if (bundle.name.includes('vendor')) {
      console.log('   Type: 📚 Third-party dependencies');
    } else if (bundle.name.includes('three-')) {
      console.log('   Type: 🎮 Three.js dependencies');
    } else if (bundle.name.includes('index')) {
      console.log('   Type: 🏠 Main application code');
    } else {
      console.log('   Type: 🧩 Feature chunk');
    }
    console.log('');
  });

  // CSS Bundles
  if (bundles.css.length > 0) {
    console.log('🟦 CSS Bundles:');
    console.log('-'.repeat(40));
    bundles.css.forEach((bundle, index) => {
      const percent = ((bundle.size / totalSize) * 100).toFixed(1);
      console.log(`${index + 1}. ${bundle.name}`);
      console.log(`   Size: ${bundle.formattedSize} (${percent}%)\n`);
    });
  }

  // Performance Analysis
  console.log('⚡ Performance Analysis:');
  console.log('-'.repeat(40));
  
  const jsSize = bundles.js.reduce((sum, bundle) => sum + bundle.size, 0);
  const cssSize = bundles.css.reduce((sum, bundle) => sum + bundle.size, 0);
  
  console.log(`JavaScript Total: ${formatBytes(jsSize)}`);
  console.log(`CSS Total: ${formatBytes(cssSize)}`);
  
  // Performance recommendations
  console.log('\n💡 Recommendations:');
  console.log('-'.repeat(40));
  
  if (jsSize > 1024 * 1024) { // > 1MB
    console.log('⚠️  JavaScript bundle is large (>1MB). Consider further code splitting.');
  } else if (jsSize > 512 * 1024) { // > 512KB
    console.log('✅ JavaScript bundle size is reasonable (<1MB).');
  } else {
    console.log('🎉 JavaScript bundle size is excellent (<512KB).');
  }

  const largestJS = bundles.js[0];
  if (largestJS && largestJS.size > 300 * 1024) { // > 300KB
    console.log(`⚠️  Largest chunk (${largestJS.name}) is ${largestJS.formattedSize}. Consider splitting.`);
  }

  // Check for good chunking
  const hasVendorChunk = bundles.js.some(b => b.name.includes('vendor'));
  const hasThreeChunks = bundles.js.filter(b => b.name.includes('three-')).length > 0;
  
  if (hasVendorChunk) {
    console.log('✅ Good vendor chunk separation detected.');
  }
  
  if (hasThreeChunks) {
    console.log('✅ Three.js dependencies are properly chunked.');
  }

  console.log('\n' + '='.repeat(60));
}

analyzeBundles();
