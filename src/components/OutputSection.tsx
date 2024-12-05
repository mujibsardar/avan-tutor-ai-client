interface OutputSectionProps {
  output: string;
}

function OutputSection({ output }: OutputSectionProps) {
  return (
    <div className="output-section-content">
      <h2>AI Response:</h2>
      <p>{output || "Waiting for input..."}</p>
    </div>
  );
}

export default OutputSection;
