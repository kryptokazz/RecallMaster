// src/pages/EditCollection.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function EditCollection() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [collections, setCollections] = useState([]);
  const [newFields, setNewFields] = useState([
    { name: 'Front', value: '' },
    { name: 'Back', value: '' },
  ]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('collections')) || [];
    setCollections(data);
    const currentCollection = data.find((c) => c.id === parseInt(collectionId));
    setCollection(currentCollection);
  }, [collectionId]);

  const handleAddField = () => {
    setNewFields([...newFields, { name: '', value: '' }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = newFields.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setNewFields(updatedFields);
  };

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      fields: newFields.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.value }),
        {}
      ),
    };
    const updatedCollection = {
      ...collection,
      cards: [...collection.cards, newCard],
    };
    const updatedCollections = collections.map((c) =>
      c.id === collection.id ? updatedCollection : c
    );
    setCollections(updatedCollections);
    setCollection(updatedCollection);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
    // Reset fields
    setNewFields(newFields.map((field) => ({ ...field, value: '' })));
  };

  const handleDeleteCard = (cardId) => {
    const updatedCollection = {
      ...collection,
      cards: collection.cards.filter((card) => card.id !== cardId),
    };
    const updatedCollections = collections.map((c) =>
      c.id === collection.id ? updatedCollection : c
    );
    setCollections(updatedCollections);
    setCollection(updatedCollection);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Edit Collection: {collection.name}
      </Typography>
      <Stack spacing={2} sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
        {newFields.map((field, index) => (
          <TextField
            key={index}
            label={field.name || `Field ${index + 1}`}
            value={field.value}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            fullWidth
          />
        ))}
        <Button variant="text" onClick={handleAddField}>
          Add Field
        </Button>
        <Button variant="contained" onClick={handleAddCard}>
          Add Card
        </Button>
      </Stack>
      <Typography variant="h5" component="h3" gutterBottom>
        Cards
      </Typography>
      <List sx={{ width: '100%', maxWidth: 600 }}>
        {collection.cards.map((card) => (
          <ListItem
            key={card.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteCard(card.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={Object.values(card.fields).join(' - ')} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default EditCollection;

