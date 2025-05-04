import { useContext, useEffect, useState } from 'react';
import { Alert, Snackbar, Box, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const ServerStatusAlert = () => {
  const { serverStatus } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Set open state based on server status
    setOpen(serverStatus === 'offline');
    
    // Log state for debugging
    if (serverStatus === 'offline') {
      console.log('Server is offline - showing alert');
    }
  }, [serverStatus]);
  
  if (serverStatus !== 'offline') {
    return null;
  }
  
  return (
    <>
      {/* Fixed position overlay alert */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'error.main',
          color: 'white',
          textAlign: 'center',
          py: 1,
          px: 2
        }}
      >
        <Typography fontWeight="bold">
          Server connection lost. You have been logged out.
        </Typography>
        <Typography variant="body2">
          Please refresh the page after restarting the server.
        </Typography>
      </Box>
      
      {/* Snackbar for additional notification */}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert severity="error" variant="filled">
          Server connection lost. You have been logged out. Please refresh the page.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ServerStatusAlert; 