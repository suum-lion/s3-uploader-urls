import "./App.css";

import { Route, Routes } from "react-router-dom";

import Callback from "./Callback";
import Home from "./Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </div>
  );
}

export default App;
