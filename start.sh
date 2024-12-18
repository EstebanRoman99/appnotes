#!/bin/bash

echo "🚀 Starting the Full Stack Application..."

# 1. Start Backend
echo "🔧 Building and starting the backend..."
cd backend
./mvnw clean install
java -jar target/*.jar &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "📦 Installing frontend dependencies and starting the frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# 3. Final Output
echo "✅ Application started successfully!"
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend: http://localhost:8080"

# Wait for the processes to finish
wait $BACKEND_PID $FRONTEND_PID