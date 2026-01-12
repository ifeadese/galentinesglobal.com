#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fixed to Galentines Global (no longer uses EVENT_ID)
const eventDir = 'galentinesglobal';

// Source directory (where images are stored for this event)
const sourceDir = path.join(__dirname, '../data', eventDir, 'images');
// Destination directory (where Next.js serves images from)
const destDir = path.join(__dirname, '../public/images');

console.log(`📦 Copying images for event: GALENTINESGLOBAL (${eventDir})`);

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.warn(`⚠ Source directory not found: ${sourceDir}`);
  console.warn(`⚠ Skipping image copy. Images may not be available.`);
  process.exit(0); // Don't fail build, just warn
}

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Get all files from source directory (excluding index.ts and other non-image files)
const files = fs.readdirSync(sourceDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpeg', '.jpg', '.png', '.svg', '.gif', '.webp'].includes(ext);
});

if (files.length === 0) {
  console.warn(`⚠ No image files found in ${sourceDir}`);
  process.exit(0);
}

// Copy each image file
let copiedCount = 0;
files.forEach((file) => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);

  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${file}`);
    copiedCount++;
  } catch (error) {
    console.error(`✗ Failed to copy ${file}:`, error.message);
  }
});

console.log(`\n✅ Image copy complete! Copied ${copiedCount} file(s).`);
