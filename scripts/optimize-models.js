#!/usr/bin/env node

/**
 * 3D Model Optimization Script
 * Optimizes GLB/GLTF models using Draco compression and other techniques
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '..', 'public', 'models');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models-optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🎮 Starting 3D model optimization...');

// Get all GLB files
const modelFiles = fs.readdirSync(INPUT_DIR).filter(file => 
  file.toLowerCase().endsWith('.glb') || file.toLowerCase().endsWith('.gltf')
);

if (modelFiles.length === 0) {
  console.log('⚠️  No 3D model files found in', INPUT_DIR);
  process.exit(0);
}

console.log(`📁 Found ${modelFiles.length} model file(s):`, modelFiles.join(', '));

modelFiles.forEach((file, index) => {
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);
  const stats = fs.statSync(inputPath);
  
  console.log(`\n🔄 Processing ${index + 1}/${modelFiles.length}: ${file}`);
  console.log(`📏 Original size: ${(stats.size / 1024).toFixed(2)} KB`);
    try {
    // First try basic optimization without Draco
    let command = `npx gltf-pipeline -i "${inputPath}" -o "${outputPath}"`;
    
    console.log('⚙️  Applying basic optimization...');
    execSync(command, { stdio: 'pipe' });
    
    // Check if basic optimization worked
    if (fs.existsSync(outputPath)) {
      const outputStats = fs.statSync(outputPath);
      const compressionRatio = ((stats.size - outputStats.size) / stats.size * 100);
      
      console.log(`✅ Optimized size: ${(outputStats.size / 1024).toFixed(2)} KB`);
      console.log(`🎯 Compression: ${compressionRatio.toFixed(1)}% reduction`);
      
      // Try Draco compression if basic optimization was beneficial
      if (compressionRatio > 5) {
        console.log('⚙️  Trying Draco compression...');
        const dracoPath = outputPath.replace('.glb', '-draco.glb');
        const dracoCommand = `npx gltf-pipeline -i "${outputPath}" -o "${dracoPath}" --draco`;
        
        try {
          execSync(dracoCommand, { stdio: 'pipe' });
          if (fs.existsSync(dracoPath)) {
            const dracoStats = fs.statSync(dracoPath);
            const dracoCompressionRatio = ((stats.size - dracoStats.size) / stats.size * 100);
            
            if (dracoCompressionRatio > compressionRatio + 10) {
              console.log(`🎯 Draco compression: ${dracoCompressionRatio.toFixed(1)}% reduction`);
              fs.copyFileSync(dracoPath, outputPath);
              fs.unlinkSync(dracoPath);
            } else {
              console.log('ℹ️  Draco compression not beneficial, keeping basic optimization');
              if (fs.existsSync(dracoPath)) fs.unlinkSync(dracoPath);
            }
          }
        } catch (dracoError) {
          console.log('⚠️  Draco compression failed, keeping basic optimization');
          if (fs.existsSync(dracoPath)) fs.unlinkSync(dracoPath);
        }
      }
    } else {
      console.log('❌ Basic optimization failed, copying original...');
      fs.copyFileSync(inputPath, outputPath);
    }
    
  } catch (error) {
    console.error(`❌ Error optimizing ${file}:`, error.message);
    console.log('📋 Copying original file...');
    fs.copyFileSync(inputPath, outputPath);
  }
});

console.log('\n✨ 3D model optimization completed!');
console.log(`📂 Optimized models saved to: ${OUTPUT_DIR}`);

// Generate a report
const reportPath = path.join(OUTPUT_DIR, 'optimization-report.json');
const report = {
  timestamp: new Date().toISOString(),
  inputDir: INPUT_DIR,
  outputDir: OUTPUT_DIR,
  files: modelFiles.map(file => {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    const inputSize = fs.existsSync(inputPath) ? fs.statSync(inputPath).size : 0;
    const outputSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
    
    return {
      name: file,
      originalSize: inputSize,
      optimizedSize: outputSize,
      compression: inputSize > 0 ? ((inputSize - outputSize) / inputSize * 100).toFixed(1) : '0',
    };
  }),
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📊 Optimization report saved to: ${reportPath}`);
