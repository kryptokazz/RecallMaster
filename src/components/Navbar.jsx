// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" component={Link} to="/RecallMaster" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Free Recall App
          </Typography>
          <Button color="inherit" component={Link} to="/collections">
            Collections
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

