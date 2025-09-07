#!/bin/bash

# API NestJS Setup Script
echo "🚀 Setting up API NestJS with TypeORM and Clean Architecture..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 20 or higher."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update the configuration as needed."
else
    echo "✅ .env file already exists."
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
npm run migration:run

# Run seeders
echo "🌱 Running database seeders..."
npm run seed

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 Your api is ready to use!"
echo ""
echo "📚 Available commands:"
echo "  npm run start:dev    - Start development server"
echo "  npm run docker:up    - Start Docker services"
echo "  npm run docker:down  - Stop Docker services"
echo "  npm run test         - Run tests"
echo "  npm run lint         - Run linter"
echo ""
echo "🌐 Access points:"
echo "  API: http://localhost:3000"
echo "  Swagger: http://localhost:3000/api/docs"
echo "  PostgreSQL: localhost:5432 (postgres / postgres)"
echo ""
echo "Happy coding! 🚀"
