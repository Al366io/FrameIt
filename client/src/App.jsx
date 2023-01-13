import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PartyRoomOwner from './pages/PartyRoomOwner'
import PartyRoomPH from './pages/PartyRoomPH'
import JoinRoom from './pages/JoinRoom'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/party/:id" element={<PartyRoomOwner />} />
          <Route path="/party/:id/ph" element={<JoinRoom />} />
          <Route path="/party/:id/ph/add" element={<PartyRoomPH />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
