import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import './App.css';
import GameDetails from './GameDetails';
import Chat from './Chat';

function GameCard({ game }) {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return (
    <div className="game-card" onClick={() => setFlipped(state => !state)}>
      <animated.div className="card-front" style={{ opacity: opacity.interpolate(o => 1 - o), transform }} >
        <h2>{game.name}</h2>
        <p>Start Time: {new Date(game.startTime).toLocaleString()}</p>
        <p>End Time: {new Date(game.endTime).toLocaleString()}</p>
        <p>Interval: {game.interval / 60} minutes</p>
        <Link to={`/game/${game._id}`} className="open-button">Open</Link>
      </animated.div>
      <animated.div className="card-back" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }}>
        <h2>Game Details</h2>
        <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Rules: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </animated.div>
    </div>
  );
}

function App() {
  const [games, setGames] = useState([]);

  // useEffect(() => {
  //   // Fetch games data from API endpoint
  //   fetch('http://localhost:3001/games')
  //     .then(response => response.json())
  //     .then(data => setGames(data))
  //     .catch(error => console.error('Error fetching games:', error));
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat</h1>
        <Router>
          <Routes>
            {/* <Route path="/" element={<div className="games-container">
              {games.map(game => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>} />
            <Route path="/game/:gameId" element={<GameDetails />} /> */}
            <Route path="/" element={<Chat />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
