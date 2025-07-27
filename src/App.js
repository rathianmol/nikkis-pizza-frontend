
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Menu from './components/Menu';
import Order from './components/Order';
import Navbar from './components/Navbar';

import { Routes, Route } from 'react-router-dom';
function App() {
  return (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/order" element={<Order />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </>

  );
}

export default App;
