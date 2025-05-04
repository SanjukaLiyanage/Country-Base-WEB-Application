import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to server.js
const serverPath = path.join(__dirname, 'server.js');

// Execute the server
const serverProcess = exec(`node ${serverPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing server: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Server stderr: ${stderr}`);
    return;
  }
  console.log(`Server output: ${stdout}`);
});

// Log server output
serverProcess.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

// Log server errors
serverProcess.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

// Handle server exit
serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
}); 