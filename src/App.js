import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Effects from "./effects"
import Calendar from "./calendar"
import BigCalendar from "./bigCalendar"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Effects />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/calendar-2" element={<BigCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
