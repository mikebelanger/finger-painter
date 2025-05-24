#!/bin/bash

# Paint with Fingers - Development Startup Script

echo "🎨 Paint with Fingers - Starting Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm to continue."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ TypeScript build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🚀 Starting development server on http://localhost:8000"
    echo "👆 Point your index finger to start painting!"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🚀 Starting development server on http://localhost:8000"
    echo "👆 Point your index finger to start painting!"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
else
    echo "❌ Python is not installed. Please install Python to run the development server."
    echo "📝 Alternatively, you can serve the files using any other web server."
    echo "   The built files are ready in the current directory."
fi