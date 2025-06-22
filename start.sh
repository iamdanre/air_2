#!/bin/bash

echo "Starting IT Salary Calculator..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if database exists
if [ ! -f "salary_data.db" ]; then
    echo "Error: salary_data.db not found. Please make sure the database file exists."
    exit 1
fi

echo ""
echo "Starting API server on port 3001..."
npm run server &
API_PID=$!

# Wait for API server to start
sleep 3

# Check if API server is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✓ API server is running"
else
    echo "✗ API server failed to start"
    kill $API_PID 2>/dev/null
    exit 1
fi

echo ""
echo "Starting frontend development server on port 3000..."
echo "The application will open automatically in your browser."
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Start frontend server (this will block)
npm run dev

# Cleanup when script exits
trap "echo 'Stopping servers...'; kill $API_PID 2>/dev/null; exit" INT TERM