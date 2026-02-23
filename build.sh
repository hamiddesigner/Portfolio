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

# Copy pre-built admin app (built locally with updated auth)
echo "Copying pre-built admin app..."
if [ -d "admin/build" ]; then
  cp -r admin/build _site/admin
  echo "✓ Admin app copied successfully"
else
  echo "✗ ERROR: admin/build directory not found!"
  exit 1
fi

echo "✓ Build complete! Files ready in _site/"

