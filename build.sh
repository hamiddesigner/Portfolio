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

# Build admin app on Netlify
echo "Installing admin dependencies..."
cd admin
npm install --legacy-peer-deps

echo "Building admin React app..."
GENERATE_SOURCEMAP=false npm run build
cd ..

# Copy admin build to _site/admin
echo "Copying admin app..."
cp -r admin/build _site/admin

echo "Build complete! Files ready in _site/"

