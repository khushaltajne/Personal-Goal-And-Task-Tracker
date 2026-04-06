#!/bin/bash

# Task Monitor Frontend - Installation & Setup Script
# This script helps you get started with the Task Monitor application

echo "🚀 Task Monitor Frontend - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your API URL."
    echo ""
    echo "   Edit .env and set:"
    echo "   VITE_API_URL=http://localhost:8080"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your backend API URL"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "Demo Credentials:"
echo "  Email: demo@example.com"
echo "  Password: password123"
echo ""
echo "For more information, see:"
echo "  - README.md"
echo "  - QUICKSTART.md"
echo "  - DOCUMENTATION.md"
echo ""
