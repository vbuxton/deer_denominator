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

      <div className="formula-box" style={{ background: '#f0f9f4', borderRadius: '8px', borderLeft: '4px solid #18453B', padding: '16px' }}>
        <p>
          <strong>Formula:</strong> Total Deer / (Trap Nights × Movement Rate × Detection Distance × (2 + Angle Left (radians) + Angle Right (radians)))
        </p>
        <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
          Note: Detection angles are converted from degrees to radians (angle × π/180)
        </p>
        <div style={{ marginTop: '16px', padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #2d6a4f' }}>
          <p style={{ fontSize: '0.875rem', color: '#333', lineHeight: '1.6', marginBottom: '8px' }}>
            <strong>References:</strong> For more details about the Random Encounter Model, the assumptions of the model, and applications of its use please start with:
          </p>
          <ol style={{ fontSize: '0.875rem', color: '#333', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              Rowcliffe, J.M., Field, J., Turvey, S.T. and Carbone, C., 2008. Estimating animal density using camera traps without the need for individual recognition. <em>Journal of Applied Ecology</em>, pp.1228-1236.
            </li>
            <li style={{ marginBottom: '8px' }}>
              Palencia, P., Barroso, P., Vicente, J., Hofmeester, T.R., Ferreres, J. and Acevedo, P., 2022. Random encounter model is a reliable method for estimating population density of multiple species using camera traps. <em>Remote Sensing in Ecology and Conservation</em>, 8(5), pp.670-682.
            </li>
            <li>
              McTigue, L.E. and DeGregorio, B.A., 2023. Effects of landcover on mesocarnivore density and detection rate along an urban to rural gradient. <em>Global Ecology and Conservation</em>, 48, p.e02716.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
