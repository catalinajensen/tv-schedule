import { useEffect, useState } from 'react';
import Schedule from './components/Schedule';
import { IChannel } from './types';
import './App.css';

function App() {
  const [channelsData, setChannelsData] = useState<IChannel[]>([]);
  const [time, setTime] = useState<Date>(new Date());

  const fetchUserData = async () => {
    const response = await fetch('http://localhost:1337/epg');
    const data = await response.json();

    setChannelsData(data?.channels);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container">
      <Schedule channels={channelsData} time={time} />
    </div>
  );
}

export default App;
