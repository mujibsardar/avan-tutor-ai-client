// src/components/SplitScreen.js
import React from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";

function SplitScreen() {
  return (
    <div className="split-screen">
      <div className="input-section">
        <InputSection />
      </div>
      <div className="output-section">
        <OutputSection />
      </div>
    </div>
  );
}

export default SplitScreen;
