import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import './GameDetails.css';

function GameDetails() {
  const { gameId } = useParams();

  const { data, isLoading, error } = useQuery(['game', gameId], async () => {
    const response = await fetch(`http://localhost:3001/games/${gameId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game details');
    }
    return response.json();
  });

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [resultsHistory, setResultsHistory] = useState([]);

  useEffect(() => {
    if (data && data.endTime && data.startTime && data.interval) {
      const startTime = new Date(data.startTime).getTime();
      const endTime = new Date(data.endTime).getTime();
      const now = Date.now();

      const updateCountdown = () => {
        const currentTime = Date.now();

        if (currentTime >= endTime) {
          setSecondsLeft(0);
          generateResult();
        } else if (currentTime < startTime) {
          setSecondsLeft(Math.floor((startTime - currentTime) / 1000));
        } else {
          const intervalMs = data.interval * 1000;
          const timeSinceStart = currentTime - startTime;
          const currentIntervalEnd = startTime + Math.ceil(timeSinceStart / intervalMs) * intervalMs;
          const secondsRemaining = Math.floor((currentIntervalEnd - currentTime) / 1000);

          if (secondsRemaining <= 0) {
            generateResult();
            setSecondsLeft(data.interval);
          } else {
            setSecondsLeft(secondsRemaining);
          }
        }
      };

      const generateResult = () => {
        const newResult = Math.floor(Math.random() * 10); // Simulate result generation
        setResultsHistory(prevHistory => [newResult, ...prevHistory].slice(0, 5));
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);
      return () => clearInterval(intervalId);
    }
  }, [data]);

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
  };

  const handleBetAmountChange = (event) => {
    setBetAmount(event.target.value);
  };

  const handleBetSubmit = () => {
    if (selectedNumber === null || !betAmount) {
      alert('Please select a number and enter the bet amount.');
      return;
    }

    console.log('Selected Number:', selectedNumber);
    console.log('Bet Amount:', betAmount);
    // Send data to the API
  };

  return (
    <div className="game-details-container">
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <h2>Game Details</h2>
          <p>Name: {data.name}</p>
          <p>Start Time: {new Date(data.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(data.endTime).toLocaleString()}</p>
          <p>Interval: {data.interval / 60} minutes</p>

          <h3 className="countdown">Time Left: {secondsLeft} seconds</h3>

          <div className="number-selection">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <button
                key={number}
                className={`number-button ${selectedNumber === number ? 'selected' : ''}`}
                onClick={() => handleNumberSelect(number)}
              >
                {number}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={betAmount}
            onChange={handleBetAmountChange}
            placeholder="Enter bet amount"
          />
          <button onClick={handleBetSubmit}>Submit Bet</button>

          <h3>Last 5 Results:</h3>
          <ul className="results-history">
            {resultsHistory.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GameDetails;
