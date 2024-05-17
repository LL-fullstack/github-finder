import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Search from "./components/Search";
import User from "./components/User";
import { useState, createContext } from "react";

export const UserContext = createContext();

function App() {
  const [profile, setProfile] = useState();

  return (
    <UserContext.Provider value={{profile, setProfile}}>
    <main>
      <div className="container">
      <Router>
      <AnimatePresence mode="wait">
      <Routes>
            <Route exact path="/" element={<Search />} />
            <Route path="/user/:userId" element={<User />} />
      </Routes>
      </AnimatePresence>
      </Router>
      </div>
    </main>
    </UserContext.Provider>
  );
}

export default App;
