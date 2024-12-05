import { useState } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";

function SplitScreen() {
  const [output, setOutput] = useState<string>("");

  const handleAPIResponse = (response: string) => {
    setOutput(response);
  };

  return (
    <div className="split-screen">
      <div className="input-section">
        <InputSection onSubmit={handleAPIResponse} />
      </div>
      <div className="output-section">
        <OutputSection output={output} />
      </div>
    </div>
  );
}

export default SplitScreen;
