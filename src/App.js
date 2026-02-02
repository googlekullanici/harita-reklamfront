import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TextPage from './TextPage';
import MapPage from './MapPage';

function App() {
  return (
    <BrowserRouter basename="/haritamfiyat">
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/textpage" element={<TextPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;