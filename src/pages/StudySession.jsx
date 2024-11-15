// src/pages/StudySession.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography, Box, Stack } from '@mui/material';

function StudySession() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [phase, setPhase] = useState('initial'); // 'initial', 'preview', 'recall', 'assessment', 'completed'
  const [timer, setTimer] = useState(10); // Default timer in minutes
  const [remainingTime, setRemainingTime] = useState(timer * 60);
  const [intervalId, setIntervalId] = useState(null);
  const [scores, setScores] = useState({});
  const [totalPasses, setTotalPasses] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('collections')) || [];
    const currentCollection = data.find(c => c.id === parseInt(collectionId));
    setCollection(currentCollection);
  }, [collectionId]);

  useEffect(() => {
    let id;
    if (phase === 'preview' || phase === 'recall') {
      id = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setPhase(phase === 'preview' ? 'recall' : 'assessment');
            setRemainingTime(timer * 60); // Reset timer for next phase
            return timer * 60;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
    return () => clearInterval(id);
  }, [phase]);

  const handleStart = () => {
    setPhase('preview');
    setRemainingTime(timer * 60);
  };

  const handlePhaseChange = () => {
    clearInterval(intervalId);
    setRemainingTime(timer * 60);
    setPhase(phase === 'preview' ? 'recall' : 'assessment');
  };

  const handleMarkCard = (cardId, passed) => {
    setScores({ ...scores, [cardId]: passed });
  };

  const handleFinishAssessment = () => {
    const passes = Object.values(scores).filter(passed => passed).length;
    setTotalPasses(passes);
    // Here you can save the scores to localStorage or update aggregate scores
    setPhase('completed');
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  if (phase === 'preview' || phase === 'recall') {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {phase === 'preview' ? 'Preview Phase' : 'Recall Phase'}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Time Remaining: {formatTime(remainingTime)}
        </Typography>
        {phase === 'preview' && (
          <Box>
            {collection.cards.map(card => (
              <Typography key={card.id} variant="body1">
                {Object.values(card.fields).join(' - ')}
              </Typography>
            ))}
          </Box>
        )}
        {phase === 'recall' && (
          <Typography variant="body1" gutterBottom>
            Try to recall all the items.
          </Typography>
        )}
        <Button variant="contained" onClick={handlePhaseChange} sx={{ mt: 2 }}>
          {phase === 'preview' ? 'Start Recall Phase' : 'Start Assessment Phase'}
        </Button>
      </Box>
    );
  }

  if (phase === 'assessment') {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Assessment Phase
        </Typography>
        {collection.cards.map((card) => (
          <Box key={card.id} sx={{ marginBottom: '10px' }}>
            <Typography variant="body1">
              {Object.values(card.fields).join(' - ')}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
              <Button
                variant={scores[card.id] === true ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleMarkCard(card.id, true)}
              >
                Pass
              </Button>
              <Button
                variant={scores[card.id] === false ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleMarkCard(card.id, false)}
              >
                Fail
              </Button>
            </Stack>
          </Box>
        ))}
        <Button variant="contained" onClick={handleFinishAssessment} sx={{ mt: 2 }}>
          Finish Assessment
        </Button>
      </Box>
    );
  }

  if (phase === 'completed') {
    const totalCards = collection.cards.length;
    const scorePercentage = ((totalPasses / totalCards) * 100).toFixed(2);

    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Session Completed
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your Score: {totalPasses} out of {totalCards} ({scorePercentage}%)
        </Typography>
        <Typography variant="body1">
          Well done! Keep studying to improve your score over time.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Study Session: {collection.name}
      </Typography>
      <TextField
        label="Set Timer (minutes)"
        type="number"
        value={timer}
        onChange={(e) => setTimer(parseInt(e.target.value))}
        sx={{ marginBottom: '20px' }}
      />
      <Button variant="contained" onClick={handleStart}>
        Start Preview Phase
      </Button>
    </Box>
  );
}

export default StudySession;

