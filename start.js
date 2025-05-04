import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the frontend
console.log('Starting React frontend...');
const frontendProcess = exec('npm run dev', (error) => {
  if (error) {
    console.error(`Error starting frontend: ${error.message}`);
    return;
  }
});

// Log frontend output
frontendProcess.stdout.on('data', (data) => {
  console.log(`Frontend: ${data}`);
});

// Log frontend errors
frontendProcess.stderr.on('data', (data) => {
  console.error(`Frontend Error: ${data}`);
});

// Start the backend server
console.log('Starting Express backend...');
const backendProcess = exec('node src/backend/server.js', (error) => {
  if (error) {
    console.error(`Error starting backend: ${error.message}`);
    return;
  }
});

// Log backend output
backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

// Log backend errors
backendProcess.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  frontendProcess.kill();
  backendProcess.kill();
  process.exit(0);
}); 