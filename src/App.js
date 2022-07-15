import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Effects from "./pages/effects"
import BigCalendar from "./pages/calendar"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Effects />} />
        <Route path="/calendar" element={<BigCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
