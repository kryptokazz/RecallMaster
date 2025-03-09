import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Snackbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('collections')) || [];
    setCollections(data);
  }, []);

        // Add this function to your Collections component
const handleDeleteCollection = (id) => {
  // Show confirmation dialog
  if (window.confirm("Are you sure you want to delete this collection?")) {
    const updatedCollections = collections.filter(collection => collection.id !== id);
    setCollections(updatedCollections);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
  }
};

  const handleAddCollection = () => {
    if (newCollectionName.trim() === '') return;
    const newCollection = { id: Date.now(), name: newCollectionName, cards: [] };
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
    setNewCollectionName('');
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleImportCsv = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;

        if (data.length === 0) {
          setSnackbarMessage('The CSV file is empty or improperly formatted.');
          setSnackbarOpen(true);
          return;
        }

        const collectionMap = {};

        data.forEach((item) => {
          const { collectionName, question, answer } = item;

          if (!collectionName || !question || !answer) {
            // Skip rows with missing data
            return;
          }

          if (!collectionMap[collectionName]) {
            collectionMap[collectionName] = {
              id: Date.now() + collectionName,
              name: collectionName,
              cards: [],
            };
          }

          collectionMap[collectionName].cards.push({ question, answer });
        });

        const newCollections = Object.values(collectionMap);
        const updatedCollections = [...collections, ...newCollections];
        setCollections(updatedCollections);
        localStorage.setItem('collections', JSON.stringify(updatedCollections));
        setCsvFile(null);
        setSnackbarMessage('CSV file imported successfully!');
        setSnackbarOpen(true);
      },
      error: function (error) {
        console.error('Error parsing CSV:', error);
        setSnackbarMessage('Error parsing CSV file.');
        setSnackbarOpen(true);
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <Button variant="contained" component="label">
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
        </Button>
        <Button variant="contained" onClick={handleImportCsv} disabled={!csvFile}>
          Import CSV
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
        <Button 
          variant="outlined" 
          color="error"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            handleDeleteCollection(collection.id);
          }}
        >
          Delete
        </Button>
      </Stack>
    }
  >
    <ListItemText primary={collection.name} />
  </ListItem>
))}      
</List>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default Collections;

