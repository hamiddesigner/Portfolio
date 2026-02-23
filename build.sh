#!/bin/bash
# Build script for Netlify deployment

set -e  # Exit on error

# Create publish directory
echo "Creating publish directory..."
rm -rf _site
mkdir -p _site

# Copy main portfolio files
echo "Copying portfolio files..."
cp *.html _site/ 2>/dev/null || true
cp *.css _site/ 2>/dev/null || true
cp *.js _site/ 2>/dev/null || true
cp *.toml _site/ 2>/dev/null || true

# Build React admin app
echo "Building React admin app..."
cd admin
npm install --legacy-peer-deps
CI=false npm run build
cd ..

# Copy built admin app to _site
echo "Copying admin app..."
if [ -d "admin/build" ]; then
  cp -r admin/build _site/admin
  echo "✓ Admin app built and copied successfully"
else
  echo "✗ ERROR: admin/build directory not found after build!"
  exit 1
fi

echo "✓ Build complete! Files ready in _site/"

