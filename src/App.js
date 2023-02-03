import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IBT from "./pages/IBT";
import Low_Income_IBT from "./pages/Low_income_IBT";
import Layout from "./pages/Layout";
import Classify from "./pages/Classification";

import "./App.css";

function App() {
  const [consumption, setConsumption] = useState(1);

  return (
    // <>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="IBT" element={<IBT />} />
          <Route path="Low_Income_IBT" element={<Low_Income_IBT />} />
          <Route path="Classification" element={<Classify />} />
        </Routes>
      </BrowserRouter>

    </div>
    // </>
  );
}

export default App;
