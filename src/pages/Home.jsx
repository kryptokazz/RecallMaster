// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Box, Button, Typography } from '@mui/material';

function Home() {
  const [studyDates, setStudyDates] = useState([]);

  useEffect(() => {
    // Load study dates from localStorage
    const data = JSON.parse(localStorage.getItem('studyDates')) || [];
    setStudyDates(data);
  }, []);

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!studyDates.includes(today)) {
      const updatedDates = [...studyDates, today];
      setStudyDates(updatedDates);
      localStorage.setItem('studyDates', JSON.stringify(updatedDates));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Free Recall App
      </Typography>
      <Button variant="contained" onClick={handleCheckIn} sx={{ mb: 4 }}>
        Check In
      </Button>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <ReactCalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={studyDates.map(date => ({ date }))}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-4`;
          }}
        />
      </Box>
    </Box>
  );
}

export default Home;

