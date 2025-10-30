#!/bin/bash

# Script untuk test build seperti di Netlify
echo "🔨 Testing Netlify build..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

# Run build command seperti di Netlify
echo ""
echo "🏗️  Building web app..."
npx turbo run build --filter=@expense-claims/web

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Check output directory
echo ""
echo "📂 Checking output directory..."
if [ -d "apps/web/dist" ]; then
  echo "✅ dist directory exists"
  echo ""
  echo "📄 Files in dist:"
  ls -lh apps/web/dist/
  echo ""
  
  # Check for important files
  if [ -f "apps/web/dist/index.html" ]; then
    echo "✅ index.html found"
  else
    echo "❌ index.html not found"
    exit 1
  fi
  
  if [ -f "apps/web/dist/_redirects" ]; then
    echo "✅ _redirects found"
  else
    echo "❌ _redirects not found"
    exit 1
  fi
  
  if [ -d "apps/web/dist/assets" ]; then
    echo "✅ assets directory found"
  else
    echo "❌ assets directory not found"
    exit 1
  fi
  
  echo ""
  echo "✅ Build successful! Ready for Netlify deployment."
  echo ""
  echo "Next steps:"
  echo "1. Push code to your Git repository"
  echo "2. Connect repository to Netlify"
  echo "3. Netlify will automatically build and deploy"
  echo ""
  echo "Or deploy now with: netlify deploy --prod"
  
else
  echo "❌ dist directory not found"
  exit 1
fi
