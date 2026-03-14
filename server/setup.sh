#!/bin/bash

echo "🚀 Setting up TaskFlow Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "📝 Please install MongoDB or use MongoDB Atlas"
    echo "   Visit: https://www.mongodb.com/try/download/community"
else
    echo "✅ MongoDB found"
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running: mongod"
echo "2. Start the server: npm run dev"
echo "3. Server will run on: http://localhost:5000"
echo ""
echo "Test the API:"
echo "  curl http://localhost:5000/health"
echo ""
