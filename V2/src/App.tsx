import VegaChart from "./Composant/vegaBase.js";
import "./App.css";
import { useState } from "react";
import { Test } from "./Composant/test.js";
import spec from "../public/data/spec.json";

const allowedValues = [
  "basis",
  "cardinal",
  "catmull-rom",
  "linear",
  "monotone",
  "natural",
  "step",
  "step-after",
  "step-before",
];

function App() {
  const [interpolate, setInterpolate] = useState("step");

  return (
    <div>
      <h1>Mon graphique Vega</h1>
      <VegaChart spec={spec} signals={{ interpolate }} />
      <Test
        value={interpolate}
        onChange={setInterpolate}
        allowedValues={allowedValues}
      />
    </div>
  );
}

export default App;
