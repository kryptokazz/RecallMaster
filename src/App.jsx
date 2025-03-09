// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collections from './pages/Collections';
import EditCollection from './pages/EditCollection';
import StudySession from './pages/StudySession';

function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/RecallMaster" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/edit-collection/:collectionId" element={<EditCollection />} />
          <Route path="/study/:collectionId" element={<StudySession />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

