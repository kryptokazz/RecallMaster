// src/pages/Collections.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('collections')) || [];
    setCollections(data);
  }, []);

  const handleAddCollection = () => {
    if (newCollectionName.trim() === '') return;
    const newCollection = { id: Date.now(), name: newCollectionName, cards: [] };
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
    setNewCollectionName('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Your Collections
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, width: '100%', maxWidth: 600 }}
        justifyContent="center"
      >
        <TextField
          label="New Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddCollection}>
          Add Collection
        </Button>
      </Stack>
      <List sx={{ width: '100%', maxWidth: 600 }}>
        {collections.map((collection) => (
          <ListItem
            key={collection.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" component={Link} to={`/edit-collection/${collection.id}`}>
                  Edit
                </Button>
                <Button variant="contained" component={Link} to={`/study/${collection.id}`}>
                  Study
                </Button>
              </Stack>
            }
          >
            <ListItemText primary={collection.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Collections;

