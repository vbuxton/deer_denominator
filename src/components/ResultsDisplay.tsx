import React from 'react';
import { CalculationResults } from '../types/index';

interface ResultsDisplayProps {
  results: CalculationResults;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="card">
      <h2>Deer Density Results</h2>

      <div className="results-header">
        <p>Average Deer Density</p>
        <p className="results-value">
          {results.averageDensity.toFixed(4)}
        </p>
      </div>

      <div>
        <h3>Per-Camera Results</h3>
        <div className="space-y-3">
          {results.perCamera.map((result) => (
            <div key={result.cameraId} className="result-list-item">
              <span>{result.cameraId}</span>
              <span>{result.density.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="formula-box">
        <p>
          <strong>Formula:</strong> Total Deer / (Trap Nights × Movement Rate × Detection Distance × (2 + Angle Left + Angle Right))
        </p>
      </div>
    </div>
  );
};
