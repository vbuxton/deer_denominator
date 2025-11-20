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
          {results.averageDensity.toFixed(4)} ± {results.standardDeviation.toFixed(4)}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
          (Mean ± Standard Deviation)
        </p>
      </div>

      <div className="space-y-4" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <h3>Summary Statistics</h3>
        <div className="grid grid-2">
          <div className="result-list-item">
            <span>Total Trap Nights:</span>
            <span>{results.totalTrapNights.toFixed(0)}</span>
          </div>
          <div className="result-list-item">
            <span>Avg Detection Rate (deer/trap night):</span>
            <span>{results.averageDetectionRate.toFixed(4)}</span>
          </div>
          <div className="result-list-item">
            <span>Avg Detection Angle Left:</span>
            <span>{results.averageAngleLeft.toFixed(2)}°</span>
          </div>
          <div className="result-list-item">
            <span>Avg Detection Angle Right:</span>
            <span>{results.averageAngleRight.toFixed(2)}°</span>
          </div>
        </div>
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
          <strong>Formula:</strong> Total Deer / (Trap Nights × Movement Rate × Detection Distance × (2 + Angle Left (radians) + Angle Right (radians)))
        </p>
        <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
          Note: Detection angles are converted from degrees to radians (angle × π/180)
        </p>
      </div>
    </div>
  );
};
