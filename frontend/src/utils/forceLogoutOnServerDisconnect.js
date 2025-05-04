/**
 * Force logout utility for server disconnection
 * 
 * This script is used to detect if the server is offline and force logout
 * the user by clearing their authentication data from localStorage.
 */

// API base URL - using only local development URL
const API_BASE_URL = 'http://localhost:5000';

// Check server status and logout if offline
export const checkServerAndLogoutIfOffline = async () => {
  console.log('Running server check from utility...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log('Server is offline, forcing logout from utility');
      forceLogout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Server connection error:', error);
    forceLogout();
    return false;
  }
};

// Force logout by clearing localStorage
export const forceLogout = () => {
  console.log('Forcing logout - clearing authentication data');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Add a flag to indicate server was disconnected
  localStorage.setItem('server_disconnected', 'true');
  
  // Force page refresh to apply changes
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Initialize by running a check immediately
if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  checkServerAndLogoutIfOffline();
  
  // Set up periodic checks
  setInterval(checkServerAndLogoutIfOffline, 5000); // Check every 5 seconds
}

export default { checkServerAndLogoutIfOffline, forceLogout }; 