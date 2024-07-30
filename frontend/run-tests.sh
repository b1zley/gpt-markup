#!/bin/bash

# Function to start backend server
start_backend() {
  echo "Starting backend server..."
  # Change directory to backend if needed
  cd ../backend || exit
  npx cross-env NODE_ENV=test node server.js &
  BACKEND_PID=$!
  cd - || exit
}

# Function to start frontend server
start_frontend() {
  echo "Starting frontend server..."
  npx vite dev &
  FRONTEND_PID=$!
}

# Function to wait for backend to be ready
wait_for_backend() {
  echo "Waiting for backend to be ready..."
  npx wait-on http-get://localhost:4000
}

# Function to wait for frontend to be ready
wait_for_frontend() {
  echo "Waiting for frontend to be ready..."
  npx wait-on http-get://localhost:5173
}

# Function to run Cypress tests
run_cypress_tests() {
  echo "Running Cypress tests..."
  npx cypress run
}

# Function to kill a specific PID
kill_pid() {
  local PID=$1
  if [ -n "$PID" ] && [ "$PID" -ne 0 ]; then
    echo "Killing process with PID $PID"
    taskkill /F /PID $PID
  fi
}

# Function to find and kill any process listening on a specific port
kill_port_process() {
  local PORT=$1
  PIDS=$(netstat -ano | grep ":$PORT" | awk '{print $5}')
  for PID in $PIDS; do
    kill_pid $PID
  done
}

# Function to clean up all background jobs
cleanup() {
  echo "Cleaning up..."
  kill_pid $BACKEND_PID
  kill_pid $FRONTEND_PID
  kill_port_process 4000
  kill_port_process 5173
}

# Start backend and frontend servers
start_backend
start_frontend

# Wait for backend and frontend to be ready
wait_for_backend
wait_for_frontend

# Run Cypress tests
run_cypress_tests

# Cleanup background jobs and any remaining processes
cleanup

echo "Tests completed."
